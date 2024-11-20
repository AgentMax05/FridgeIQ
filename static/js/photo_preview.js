let video = document.querySelector("video#videoElement");
let canvas = document.querySelector("canvas#previewCanvas")
let context = canvas.getContext("2d");

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
    .then((stream) => {
        video.srcObject = stream;

        video.addEventListener("loadedmetadata", () => {
            canvas.width = video.videoHeight;
            canvas.height = video.videoWidth;

            // canvas.width = video.videoWidth;
            // canvas.height = video.videoHeight;

            requestAnimationFrame(drawRotatedFrame);
        })
    })
    .catch((error) => {
        console.log("Video preview not working!");
    })
}

function drawRotatedFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((90 * Math.PI) / 180);
    context.drawImage(video, -video.videoWidth / 2, -video.videoHeight / 2);
    context.restore();
    requestAnimationFrame(drawRotatedFrame);
}