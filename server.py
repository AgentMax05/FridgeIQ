#server.py
from flask import Flask, jsonify, render_template, send_file, Response, stream_with_context
import detect 

import json

from threading import Thread

from picamera2 import Picamera2
import adafruit_dht
import board
import io

from PIL import Image
from pyzbar.pyzbar import decode
import requests

from time import sleep
import time

import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
buzzer=23
GPIO.setup(buzzer,GPIO.OUT)

def beep_buzzer(length=0.2):
    GPIO.output(buzzer, GPIO.HIGH)
    sleep(length)
    GPIO.output(buzzer, GPIO.LOW)

def beep(length=0.2):
    thread = Thread(target=beep_buzzer, args=[length])
    thread.start()

dht_device = adafruit_dht.DHT11(board.D4)

app = Flask(__name__)

picam2 = Picamera2()

scanned_items = {}

# camera_config = picam2.create_still_configuration(
#     # main={"size": (640, 480)},
#     main={"size": (1920, 1080)},
#     buffer_count=3
# )

preview_config = picam2.create_still_configuration(main={"size": (640, 480)}, buffer_count = 1)
picam2.configure(preview_config)

picam2.set_controls({"AfMode": 2})  # 2 = Continuous autofocus (if supported)
picam2.set_controls({"FrameRate": 80})

picam2.start()

frame = picam2.capture_array()

STORAGE = {}

with open("./storage.json", "r") as storageFile:
    STORAGE = json.load(storageFile)

def update_frame():
    global frame
    while True:
        frame = picam2.capture_array()
        sleep(1.0 / 80)

update_frame_thread = Thread(target=update_frame)
update_frame_thread.start()

def generate_preview():
    while True:
        img_io = io.BytesIO()
        from PIL import Image
        Image.fromarray(frame).save(img_io, format="JPEG")
        img_io.seek(0)

        # Yield the frame as part of an SSE response
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + img_io.read() + b'\r\n')

@app.route('/')
def hello_world():
    return render_template("index.html")

@app.route("/get-image-preview", methods=["GET"])
def get_image():
    return Response(stream_with_context(generate_preview()), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/vision", methods=["GET"])
def detect_food():
    picam2.capture_file("temp_image.jpg")

    food_objects = detect.detect_foods("temp_image.jpg")
    return jsonify({"ok": True, "message": food_objects}), 200

@app.route("/capture", methods=["GET"])
def capture_image():
    try:
        barcodes = decode(frame)

        items = []
        
        for barcode in barcodes:
            barcode_data = barcode.data.decode("utf-8")
            api_url = f"https://world.openfoodfacts.org/api/v0/product/{barcode_data}.json"
            response = requests.get(api_url)
            if response.status_code == 200:
                product_data = response.json()
                if product_data.get("status") == 1:
                    product_name = product_data["product"].get("product_name", "Unknown Product")
                    print(f"Food item found: {product_name}")
                    
                    if product_name in scanned_items.keys():
                        if (time.time() - scanned_items[product_name]) <= 2:
                            continue
                    
                    scanned_items[product_name] = time.time()
                    items.append(product_name)
                    beep()
    
        return jsonify({"ok": True, "message": items}), 200

    except Exception as e:
        return jsonify({"ok": False, "message": str(e)}), 500

@app.route("/dht11", methods=["GET"])
def get_dht11():
    try:
        temperature_c = dht_device.temperature
        humidity = dht_device.humidity
        print(f"{temperature_c} C")
        print(f"Humidity: {humidity}")
        temperature_f = temperature_c * (9 / 5) + 32

        return jsonify({"ok": True, "message": {"temperature": round(temperature_f, 2), "humidity": round(humidity, 2)}}), 200
    except Exception as e:
        sleep(0.2)
        print("retrying dht11")
        return get_dht11()
