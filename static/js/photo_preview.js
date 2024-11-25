//photo_preview.js
let video = document.querySelector("video#videoElement");
let canvas = document.querySelector("canvas#previewCanvas")
let context = canvas.getContext("2d");

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
    .then((stream) => {
        video.srcObject = stream;

        video.addEventListener("loadedmetadata", () => {
            // Set square dimensions
            const size = 350;  // Square size
            canvas.width = size;
            canvas.height = size;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;

            requestAnimationFrame(drawFrame);
        })
    })
    .catch((error) => {
        console.log("Video preview not working!");
    })
}

function drawFrame() {
    // Calculate dimensions to crop the video to a square
    const size = Math.min(video.videoWidth, video.videoHeight);
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    // Draw only the square center portion of the video
    context.drawImage(video, 
        startX, startY, size, size,  // Source (crop) coordinates
        0, 0, canvas.width, canvas.height  // Destination coordinates
    );
    requestAnimationFrame(drawFrame);
}