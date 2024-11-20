let captureButton = document.querySelector("button#captureButton");

captureButton.addEventListener("click", () => {
    takePicture();
}, false);

function takePicture() {
    const data = canvas.toDataURL("image/png");
    // console.log(data);
    let a = document.createElement("a");
    a.href = data;
    a.download = "webcam_photo.png";
    a.click();
}