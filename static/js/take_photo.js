//take_photo.js
let captureButton = document.querySelector("button#captureButton");

captureButton.addEventListener("click", () => {
    takePictureVision();
}, false);

let num = 0;

function takePictureVision() {
    // fetch("/vision")
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
    // let keys = Object.keys(data.message);
    // for (let i = 0; i < keys.length; i++) {
    let objects = ["apple", "banana", "pear"];
    addItem(objects[num], 1);
    num++;
    // }
    //     }
    // })
    // .catch(error => {
    //     console.error("Error: ", error);
    // })

    setTimeout(() => {takePicture()}, 100);   
}

function addErrorMessage(errorMessage, delay=3000) {
    const popup = document.getElementById('error-popup');

    popup.textContent = errorMessage;
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, delay);
}

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
        if (!data.ok) {
            addErrorMessage(data.message);
        } else {
            for (let i = 0; i < data.message.length; i++) {
                addItem(data.message[i], 1);
            }
        }
    })
    .catch(error => {
        console.error("Error: ", error);
    })

    setTimeout(() => {takePicture()}, 100);
}

takePicture();
