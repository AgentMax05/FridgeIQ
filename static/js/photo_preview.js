//photo_preview.js
let previewCanvas = document.querySelector("canvas#previewCanvas");
let captureCanvas = document.createElement('canvas'); // Separate canvas for capturing
let previewContext = previewCanvas.getContext("2d");
let captureContext = captureCanvas.getContext("2d");

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: {
            width: { ideal: 4096 }, // Request higher resolution
            height: { ideal: 3072 },
            facingMode: "environment", // Use back camera if available
            aspectRatio: { ideal: 4/3 },
            frameRate: { ideal: 30 },
            resizeMode: "none" // Prevent automatic resizing
        }, 
        audio: false
    })

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
    // Preview: square crop and scale down
    const size = Math.min(video.videoWidth, video.videoHeight);
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    previewContext.drawImage(video, 
        startX, startY, size, size,
        0, 0, previewCanvas.width, previewCanvas.height
    );

    // Full resolution capture canvas
    captureContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    requestAnimationFrame(drawFrame);
}