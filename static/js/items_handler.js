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

let items = [];

let pName = document.querySelector(".itemPreview .itemName");
let expirationDateInput = document.querySelector(".itemPreview .datePicker");

document.querySelector(".itemPreview button").addEventListener("click", () => {
    pushItem(pName.innerHTML, 1, expirationDateInput.value);
    expirationDateInput.value = "";
})

function addItem(itemName, count) {
    pName.innerHTML = itemName;
}

function pushItem(itemName, count, expirationDate) {
    let foundIndex = -1;
    for (let i = 0; i < items.length; i++) {
        if (items[i].name == itemName && items[i].expiration == expirationDate) {
            foundIndex = i;
            items[i].count += count;
            break;
        }
    }
    if (foundIndex >= 0) {
        let existingItem = itemsList.querySelector(`[data-name="${itemName}"][data-expiration="${expirationDate}"]`);
        existingItem.setAttribute("data-count", items[foundIndex].count);
        existingItem.querySelector(".count").innerHTML = items[foundIndex].count;
    } else {
        items.push({name: itemName, count: count, expiration: expirationDate});
        let newItem = document.createElement("div");
        newItem.classList.add("detected-item");
        newItem.setAttribute("data-name", itemName);
        newItem.setAttribute("data-count", count);
        newItem.setAttribute("data-expiration", expirationDate);

        let nameP = document.createElement("p");
        nameP.classList.add("name");
        nameP.innerHTML = itemName;

        let expP = document.createElement("p");
        expP.classList.add("expiration");
        expP.innerHTML = expirationDate;

        let countP = document.createElement("p");
        countP.classList.add("count");
        countP.innerHTML = count;

        newItem.appendChild(nameP);
        newItem.appendChild(expP);
        newItem.appendChild(countP);

        itemsList.appendChild(newItem);
    }
}

addItem("test", 1);