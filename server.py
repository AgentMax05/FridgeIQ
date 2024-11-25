#server.py
from flask import Flask, jsonify, render_template 
from picamera2 import Picamera2
import detect 

import adafruit_dht
import board

dht_device = adafruit_dht.DHT11(board.D4)

app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template("index.html")

@app.route("/capture", methods=["GET"])
def capture_image():
    picam2 = Picamera2()
    camera_config = picam2.create_still_configuration(main={"size": (1920, 1080)}, lores={"size": (640, 480)}, display="lores")
    picam2.configure(camera_config)

    try:
        picam2.start()
        picam2.capture_file("temp_image.jpg")
        picam2.stop()

        food_objects = detect.detect_foods("./temp_image.jpg")

        return jsonify({"ok": True, "message": food_objects}), 200

    except Exception as e:
        return jsonify({"ok": False, "message": str(e)}), 500

@app.route("/dht11", methods=["GET"])
def get_dht11():
    try:
        temperature_c = dht_device.temperature
        temperature_f = temperature_c * (9 / 5) + 32
        humidity = dht_device.humidity

        return jsonify({"ok": True, "message": {"temperature": temperature_f, "humidity": humidity}}), 200
    except Exception as e:
        return jsonify({"ok": False, "message": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True)