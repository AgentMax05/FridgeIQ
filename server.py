#server.py
from flask import Flask, jsonify, render_template, send_file, Response, stream_with_context
import detect 

from threading import Thread

from picamera2 import Picamera2
import adafruit_dht
import board
import io

from PIL import Image
from pyzbar import decode
import requests

from time import sleep

dht_device = adafruit_dht.DHT11(board.D4)

app = Flask(__name__)
##

picam2 = Picamera2()

camera_config = picam2.create_still_configuration(
    main={"size": (640, 480)},
    buffer_count=3
)

picam2.configure(camera_config)

picam2.set_controls({"AfMode": 2})  # 2 = Continuous autofocus (if supported)
picam2.set_controls({"FrameRate": 30})

picam2.start()
image_path = "./temp_capture.jpg"

frame = picam2.capture_array()

def update_frame():
    global frame
    while True:
        frame = picam2.capture_array()
        sleep(1.0 / 30)

update_frame_thread = Thread(target=update_frame)
update_frame_thread.start()

def generate_preview():
    while True:
        # Capture the frame as a JPEG
        # frame = picam2.capture_array()
        img_io = io.BytesIO()
        from PIL import Image  # Importing here to ensure clean module usage
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
    # picam2.capture_file(image_path)
    # send_file(image_path, mimetype="image/jpeg")
    return Response(stream_with_context(generate_preview()), mimetype='multipart/x-mixed-replace; boundary=frame')



@app.route("/capture", methods=["GET"])
def capture_image():
    # picam2 = Picamera2()
    # camera_config = picam2.create_still_configuration(main={"size": (1920, 1080)}, lores={"size": (640, 480)}, display="lores")
    # picam2.configure(camera_config)
    # picam2.set_controls({"AfMode": 2, "AfTrigger": 0})

    try:
    #     picam2.start()
        picam2.capture_file("temp_image.jpg")
    #     picam2.stop()

        img = Image.open("temp_image.jpg")
        barcodes = decode(img)

        items = []
        
        for barcode in barcodes:
            barcode_data = barcode.data.decode("utf-8")
            api_url = f"https://world.openfoodfacts.org/api/v0/product/{barcode_data}.json"
            response = requests.get(api_url)
            if response.status_code == 200:
                product_data = response.json()
                items.append(product_data)

        print(items)

        # food_objects = detect.detect_foods("./temp_image.jpg")

        # return jsonify({"ok": True, "message": food_objects}), 200
        return jsonify({"ok": True, "message": []}), 200

    except Exception as e:
        return jsonify({"ok": False, "message": str(e)}), 500

    # return jsonify({"ok": False, "message": str(e)}), 500

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
        # return jsonify({"ok": False, "message": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True)