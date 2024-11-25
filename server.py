from flask import Flask, jsonify, render_template 
from picamera2 import Picamera2
import detect 

picam2 = Picamera2()

app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template("index.html")

@app.route("/capture", methods=["GET"])
def capture_image():
    try:
        picam2.start()
        picam2.capture_file("temp_image.jpg")
        picam2.stop()

        food_objects = detect.detect_foods("./temp_image.jpg")

        return jsonify({"error": False, "message": food_objects}), 200

    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True)