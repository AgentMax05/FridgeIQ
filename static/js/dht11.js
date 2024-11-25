let humidityText = document.querySelector(".sensor-value .humidity");
let temperatureText = document.querySelector(".sensor-value .temperature");

function getDHT11() {
    fetch("/dht11")
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
            humidityText.innerHTML = `${data.message.humidity}%`;
            temperatureText.innerHTML = `${data.message.temperature}°F`;
            setTimeout(() => {getDHT11()}, 5000);
        }
    })
    .catch(error => {
        console.error("Error: ", error);
    })
}

getDHT11();