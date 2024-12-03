//take_photo.js
let captureButton = document.querySelector("button#captureButton");

captureButton.addEventListener("click", () => {
    takePicture();
}, false);

function addErrorMessage(errorMessage, delay=3000) {
    const popup = document.getElementById('error-popup');

    popup.textContent = errorMessage;
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, delay);
}

function takePicture() {
    // fetch("/capture")
    // .then(response => {
    //     if (!response.ok) {
    //         console.log("HTTP Error when capturing image");
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log("Received: ", data);
    //     if (!data.ok) {
    //         addErrorMessage(data.message);
    //     } else {
    //         let keys = Object.keys(data.message);
    //         for (let i = 0; i < keys.length; i++) {
    //             addItem(keys[i], data.message[keys[i]]);
    //         }
    //     }
    // })
    // .catch(error => {
    //     console.error("Error: ", error);
    // })

    const data = captureCanvas.toDataURL("image/png");
    console.log(data);
    let a = document.createElement("a");
    a.href = data;
    a.download = "webcam_photo.png";
    a.click();

    // const track = stream.getVideoTracks()[0];
    // const imageCapture = new ImageCapture(track);

    // imageCapture.takePhoto().then(blob => {
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `photo_${Date.now()}.png`;
    //     a.click();
    // }).catch(error => console.error('Photo capture error:', error));
}

let imageCapture;

// function onGetUserMediaButtonClick() {
//   navigator.mediaDevices
//     .getUserMedia({ video: true })
//     .then((mediaStream) => {
//       document.querySelector("video").srcObject = mediaStream;

//       const track = mediaStream.getVideoTracks()[0];
//       imageCapture = new ImageCapture(track);
//     })
//     .catch((error) => console.error(error));
// }

// function onGrabFrameButtonClick() {
//   imageCapture
//     .grabFrame()
//     .then((imageBitmap) => {
//       const canvas = document.querySelector("#grabFrameCanvas");
//       drawCanvas(canvas, imageBitmap);
//     })
//     .catch((error) => console.error(error));
// }

function onTakePhotoButtonClick() {
  imageCapture
    .takePhoto()
    .then((blob) => createImageBitmap(blob))
    .then((imageBitmap) => {
      const canvas = document.querySelector("#takePhotoCanvas");
      drawCanvas(canvas, imageBitmap);
    })
    .catch((error) => console.error(error));
}

/* Utils */

function drawCanvas(canvas, img) {
  canvas.width = getComputedStyle(canvas).width.split("px")[0];
  canvas.height = getComputedStyle(canvas).height.split("px")[0];
  let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  let x = (canvas.width - img.width * ratio) / 2;
  let y = (canvas.height - img.height * ratio) / 2;
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  canvas
    .getContext("2d")
    .drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      x,
      y,
      img.width * ratio,
      img.height * ratio,
    );
}

document.querySelector("video").addEventListener("play", () => {
  document.querySelector("#grabFrameButton").disabled = false;
  document.querySelector("#takePhotoButton").disabled = false;
});