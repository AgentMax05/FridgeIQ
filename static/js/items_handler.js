//items_handler.js

function removeItem(event) {
    const item = event.target.closest('.detected-item');
    delete items[item.getAttribute("data-name")];
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

const itemsList = document.querySelector("div.items-list");

let items = {};

function addItem(itemName, count) {
    if (items.hasOwnProperty(itemName)) {
        items[itemName] += count;
        let existingItem = itemsList.querySelector(`[data-name="${itemName}"]`);
        existingItem.setAttribute("data-count", items[itemName]);
        existingItem.querySelector(".count").innerHTML = items[itemName];
    } else {
        items[itemName] = count;
        let newItem = document.createElement("div");
        newItem.classList.add("detected-item");
        newItem.setAttribute("data-name", itemName);
        newItem.setAttribute("data-count", count);

        let nameP = document.createElement("p");
        nameP.classList.add("name");
        nameP.innerHTML = itemName;

        let countP = document.createElement("p");
        countP.classList.add("count");
        countP.innerHTML = count;

        newItem.appendChild(nameP);
        newItem.appendChild(countP);

        itemsList.appendChild(newItem);
    }
}