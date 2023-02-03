//object for weather codes
const weather_codes = {
    '0':'Clear sky',
    '1':'Mainly clear',
    '2':'Partly cloudy',
    '3':'Overcast',
    '45':'Fog',
    '48':'Depositing rime fog',
    '51':'Drizzle: Light',
    '53':'Drizzle: Moderate',
    '55':'Drizzle: Dense',
    '56':'Freezing Drizzle: Light',
    '57':'Freezing Drizzle: Moderate',
    '61':'Rain: Slight',
    '63':'Rain: Moderate',
    '65':'Rain: Heavy',
    '66':'Freezing Rain: Light',
    '67':'Freezing Rain: Heavy',
    '71':'Snow fall: Slight',
    '73':'Snow fall: Moderate',
    '75':'Snow fall: Heavy',
    '77':'Snow grains',
    '80':'Rain showers: Slight',
    '81':'Rain showers: Moderate',
    '82':'Rain showers: Violent',
    '85':'Snow showers: slight',
    '86':'Snow showers Heavy',
    '95':'Thunderstorm',
    '96':'Thunderstorm: Slight hail',
    '99':'Thunderstorm: Heavy hail'
};

//fetches the hourly weather data from the API and adds the data to hourly_html
async function fetchHourlyWeather(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            let hourly_html = "";
            //loops through the data 24 times (for 24 hours of info)
            for (let i = 0; i <= 24; i++) {
                //creates a div with the data for each hour
                hourly_html += `<div class="hourlyWeatherCard">`
                hourly_html += `<p>Time: ${data.hourly.time[i]}</p>`
                hourly_html += `<p>Temperature: ${data.hourly.temperature_2m[i]}${data.hourly_units.temperature_2m}</p>`
                hourly_html += `<p>Humidity: ${data.hourly.relativehumidity_2m[i]}${data.hourly_units.relativehumidity_2m}</p>`
                hourly_html += `<p>Wind direction: ${data.hourly.winddirection_10m[i]}${data.hourly_units.winddirection_10m}</p>`
                hourly_html += `<p>Conditions: ${weather_codes[data.hourly.weathercode[i]]}</p>`
                hourly_html += `</div>`
            }
            //runs updateHourlyWeather function with the html added the previous for loop
            updateHourlyWeather(hourly_html);
        })
        .catch(error => console.error('Error:', error))
}

// fetches the daily weather data from the API and adds the data to daily_html
async function fetchDailyWeather(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            let daily_html = "";
            //loops through the length of daily time object from the API fetch result
            for (let i = 0; i < data.daily.time.length; i++) {
                //creates a div with the data for each day
                daily_html += `<div class="dailyWeatherCard">`
                daily_html += `<p>${data.daily.time[i]}</p>`
                daily_html += `<img></img>`
                daily_html += `</div>`
            }
            //runs updateDailyWeather function with the html added the previous for loop
            updateDailyWeather(daily_html);
        })
        .catch(error => console.error('Error:', error))
}
// fetches the current weather data from the API and runs the updateCurrentWeather using data from the api and variables containing data from the api
async function fetchCurrentWeather(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            let relative_humidity;
            let conditions_data;
            //loops through 24 hours of data
            for (let i = 0; i <= 24; i++) {
                //checks if hour in loop is the same as the current time. If it is sets the corresponding relative humidity as relative_humidity so it can be displayed in the current humidity section
                if (data.hourly.time[i] == data.current_weather.time){
                    relative_humidity = data.hourly.relativehumidity_2m[i];
                }
            }
            // sets the conditions as the value of the weather code object that corresponds with the weather code received from the API
            conditions_data = weather_codes[data.current_weather.weathercode]
            //runs the updateCurrentWeather function using data from the api and the variables made above
            updateCurrentWeather(data.current_weather.temperature, data.current_weather.windspeed, data.current_weather.winddirection, data.current_weather.time, relative_humidity, conditions_data)
        })
        .catch(error => console.error('Error:', error))
}
//this function updates the HTML to display the current weather data
function updateCurrentWeather(temperature, windspead, winddirection, time, humidity, conditions) {
    // gets the elements that will be displaying the data from the API
    const current_date = document.getElementById("current_date");
    const current_temp = document.getElementById("current_temp");
    const current_windspeed = document.getElementById("current_windspeed");
    const current_winddirection = document.getElementById("current_winddirection");
    let current_humidity = document.getElementById("current_humidity");
    let current_conditions = document.getElementById("current_conditions");
    //changes the inner html of the elements grabbed above to display the weather data grabbed in the fetchCurrentWeather function
    current_date.innerHTML = `<p>Time: ${time}</p>`
    current_windspeed.innerHTML = `<p>Wind speed: ${windspead}</p>`
    current_winddirection.innerHTML = `<p>Wind direction: ${winddirection}</p>`
    current_temp.innerHTML = `<p>Temperature: ${temperature}</p>`
    current_humidity.innerHTML = `<p>Humidity: ${humidity}</p>`
    current_conditions.innerHTML = `<p>Conditions: ${conditions}</p>`
}

//updates the daily weather section using html created in the fetchDailyWeather function
function updateDailyWeather(html) {
    const weekly_report = document.getElementById("weekly-report");

    weekly_report.innerHTML = html
}

//updates the hourly weather section using html created in the fetchHourlyWeather function
function updateHourlyWeather(html) {
    const Hourly_report = document.getElementById("Hourly-report");

    Hourly_report.innerHTML = html
}

//this function is run when the user changes the city
//it runs the all the fetch functions using the API url for that city
function changeCityWeather() {
    let city = document.getElementById("city")
    let cityValue = city.value;

    const current_city = document.getElementById("current_city");
    
    
    //fetches data for regina if the user selects regina
    if (cityValue == "regina") {
        current_city.innerHTML = `<p>Regina</p>`
        fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=-104.62&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')


        fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=-104.624&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')


        fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=-104.62&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');
    }
    //fetches data for saskatoon if the user selects saskatoon
    else if (cityValue == "saskatoon") {
        current_city.innerHTML = `<p>Saskatoon</p>`
        fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=52.14&longitude=-106.64&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')


        fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=52.14&longitude=-106.64&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')


        fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=52.14&longitude=-106.64&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');
    }
    //fetches data for prince albert if the user selects prince albert
    else if (cityValue == "prince_albert") {
        current_city.innerHTML = `<p>Prince Albert</p>`
        fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=53.20&longitude=-105.75&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')


        fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=53.20&longitude=-105.75&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')


        fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=53.20&longitude=-105.75&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');
    }
    //fetches data for moose jaw if the user selects moose jaw
    else if (cityValue == "moose_jaw") {
        current_city.innerHTML = `<p>Moose Jaw</p>`
        fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=50.39&longitude=-105.53&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')


        fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.39&longitude=-105.53&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')


        fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.39&longitude=-105.53&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');
    }
    //fetches data for swift current if the user selects swift current
    else if (cityValue == "swift_current") {
        current_city.innerHTML = `<p>Swift Current</p>`
        fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=50.28&longitude=-107.79&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')


        fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.28&longitude=-107.79&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')


        fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.28&longitude=-107.79&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');
    }
    //fetches data for northbattleford if the user selects north battleford
    else if (cityValue == "north_battleford") {
        current_city.innerHTML = `<p>North Battleford</p>`
        fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=52.77&longitude=-108.29&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')


        fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=52.77&longitude=-108.29&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')


        fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=52.77&longitude=-108.29&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');
    }
}
