
async function fetchHourlyWeather(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)

            console.log(data.hourly.time.length)
            for (let i = 0; i < data.hourly.time.length; i++) {
                console.log(`Time: ${data.hourly.time[i]}`)
                console.log(`Temperature: ${data.hourly.temperature_2m[i]}${data.hourly_units.temperature_2m}`)
                console.log(`Humidity: ${data.hourly.relativehumidity_2m[i]}${data.hourly_units.relativehumidity_2m}`)
                console.log(`Wind direction: ${data.hourly.winddirection_10m[i]}${data.hourly_units.winddirection_10m}`)
            }
        })
        .catch(error => console.error('Error:', error))
}



async function fetchDailyWeather(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)

        })
        .catch(error => console.error('Error:', error))
}

document.addEventListener("DOMContentLoaded", (event) => {
    fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=-104.62&hourly=temperature_2m,relativehumidity_2m,winddirection_10m&timezone=CST');

    fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=-104.62&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')

});


