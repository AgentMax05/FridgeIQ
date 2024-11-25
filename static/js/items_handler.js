//items_handler.js
// Add event delegation for double-click handling
document.querySelector('.items-list').addEventListener('dblclick', (event) => {
    // Check if clicked element is a detected item
    const item = event.target.closest('.detected-item');
    if (item) {
        // Remove the item with a fade-out effect
        item.style.opacity = '0';
        setTimeout(() => {
            item.remove();
        }, 200);
    }
});