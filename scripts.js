
async function fetchWeather(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)

            console.log(data.hourly.time.length)
            for (let i = 0; i < data.hourly.time.length; i++) {
                console.log(`Time: ${data.hourly.time[i]} `)
                console.log(`Temperature: ${data.hourly.temperature_2m[i]}`)
                console.log(`Humidity: ${data.hourly.relativehumidity_2m[i]}`)
                console.log(`Wind direction: ${data.hourly.winddirection_10m[i]}`)
            }
        })
        .catch(error => console.error('Error:', error))
}

document.addEventListener("DOMContentLoaded", (event) => {
    (fetchWeather('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=-104.62&hourly=temperature_2m,relativehumidity_2m,winddirection_10m'));
});


