//take_photo.js
let captureButton = document.querySelector("button#captureButton");

captureButton.addEventListener("click", () => {
    takePicture();
}, false);

function takePicture() {
    fetch("/capture")
    .then(response => {
        if (!response.ok) {
            console.log("HTTP Error when capturing image");
        }
        return response.json();
    })
    .then(data => {
        console.log("Received: ", data);
        let keys = Object.keys(data.message);
        for (let i = 0; i < keys.length; i++) {
            addItem(keys[i], data.message[keys[i]]);
        }
    })
    .catch(error => {
        console.error("Error: ", error);
    })

    // const data = canvas.toDataURL("image/png");
    // // console.log(data);
    // let a = document.createElement("a");
    // a.href = data;
    // a.download = "webcam_photo.png";
    // a.click();
}