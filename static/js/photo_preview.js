// // photo_preview.js
// let previewCanvas = document.querySelector("canvas#previewCanvas");
// let captureCanvas = document.createElement('canvas');
// let previewContext = previewCanvas.getContext("2d");
// let captureContext = captureCanvas.getContext("2d");

// let video = document.querySelector("video#videoElement");

// // Request high resolution but don't force it
// if (navigator.mediaDevices.getUserMedia) {
//     navigator.mediaDevices.getUserMedia({
//         video: {
//             width: { exact: 4096 },
//             height: { exact: 3072 },
//             facingMode: "environment",
//             aspectRatio: { exact: 4/3 }
//         },
//         audio: false
//     }).then((stream) => {
//         video.srcObject = stream;
        
//         // Log actual video dimensions for debugging
//         video.addEventListener("loadedmetadata", () => {
//             console.log("Video dimensions:", video.videoWidth, "x", video.videoHeight);
            
//             // Set preview canvas size
//             const previewSize = 350;
//             previewCanvas.width = previewSize;
//             previewCanvas.height = previewSize;
//             previewCanvas.style.width = `${previewSize}px`;
//             previewCanvas.style.height = `${previewSize}px`;

//             // Set capture canvas to video dimensions
//             captureCanvas.width = video.videoWidth;
//             captureCanvas.height = video.videoHeight;

//             requestAnimationFrame(drawFrame);
//         });
//     })
//     .catch((error) => {
//         console.log("Video preview error:", error);
//         // Log constraints that weren't accepted
//         console.log("Failed constraints:", error.constraint);
//     });
// }

// function drawFrame() {
//     if (video.readyState === video.HAVE_ENOUGH_DATA) {
//         // Preview: square crop and scale down
//         const size = Math.min(video.videoWidth, video.videoHeight);
//         const startX = (video.videoWidth - size) / 2;
//         const startY = (video.videoHeight - size) / 2;

//         previewContext.drawImage(video, 
//             startX, startY, size, size,
//             0, 0, previewCanvas.width, previewCanvas.height
//         );

//         // Full resolution capture canvas
//         captureContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
//     }
    
//     requestAnimationFrame(drawFrame);
// }

// // // take_photo.js
// // function takePicture() {
// //     // Use maximum quality for PNG
// //     const data = captureCanvas.toDataURL('image/png', 1.0);
    
// //     // Save the image
// //     const a = document.createElement('a');
// //     a.href = data;
// //     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
// //     a.download = `webcam_photo_${timestamp}.png`;
// //     a.click();
// // }