
async function fetchWeather(url) {
    await fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error))
}

document.addEventListener("DOMContentLoaded", (event) => {
fetchWeather('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=-104.62&hourly=temperature_2m,relativehumidity_2m,winddirection_10m')
});
