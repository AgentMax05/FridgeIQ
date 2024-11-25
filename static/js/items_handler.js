//items_handler.js

function removeItem(event) {
    const item = event.target.closest('.detected-item');
    if (item) {
        item.style.opacity = '0';
        setTimeout(() => {
            item.remove();
        }, 200);
    }
}

let lastTap = 0;

document.querySelector('.items-list').addEventListener('dblclick', removeItem);
document.querySelector(".items-list").addEventListener("touchstart", (event) => {
    const currentTime = new Date().getTime();
    const tapGap = currentTime - lastTap;

    if (tapGap < 500 && tapGap > 0) {
        removeItem(event);
    }

    lastTap = currentTime;
})