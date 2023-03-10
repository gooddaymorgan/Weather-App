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

const weather_images = {
    '0':'<img src="images/sunshine.png" alt="sun">',
    '1':'<img src="images/sunshine.png" alt="sun">',
    '2':'<img src="images/p-cloud.png" alt="cloudy sun">',
    '3':'<img src="images/cloud.png" alt="cloud">',
    '45':'<img src="images/fog.png" alt="fog">',
    '48':'<img src="images/fog.png" alt="fog">',
    '51':'<img src="images/rainy.png" alt="raincloud">',
    '53':'<img src="images/rainy.png" alt="raincloud">',
    '55':'<img src="images/rainy.png" alt="raincloud">',
    '56':'<img src="images/rainy.png" alt="raincloud">',
    '57':'<img src="images/rainy.png" alt="raincloud">',
    '61':'<img src="images/rainy.png" alt="raincloud">',
    '63':'<img src="images/rainy.png" alt="raincloud">',
    '65':'<img src="images/rainy.png" alt="raincloud">',
    '66':'<img src="images/snow.png" alt="snowing cloud">',
    '67':'<img src="images/snow.png" alt="snowing cloud">',
    '71':'<img src="images/snow.png" alt="snowing cloud">',
    '73':'<img src="images/snow.png" alt="snowing cloud">',
    '75':'<img src="images/snow.png" alt="snowing cloud">',
    '77':'<img src="images/snow.png" alt="snowing cloud">',
    '80':'<img src="images/snow.png" alt="snowing cloud">',
    '81':'<img src="images/snow.png" alt="snowing cloud">',
    '82':'<img src="images/snow.png" alt="snowing cloud">',
    '85':'<img src="images/snow.png" alt="snowing cloud">',
    '86':'<img src="images/snow.png" alt="snowing cloud">',
    '95':'<img src="images/thunder.png" alt="thunder cloud">',
    '96':'<img src="images/thunder.png" alt="thunder cloud">',
    '99':'<img src="images/thunder.png" alt="thunder cloud">',
};

//fetches the hourly weather data from the API and adds the data to hourly_html
async function fetchHourlyWeather(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            let hourly_html = "";
            let how_it_feels;
            //slices the date to the time isn't included
            let date = data.hourly.time[1].slice(0,10)
            //loops through the data 24 times (for 24 hours of info)
            for (let i = 0; i <= 24; i++) {
                //runs function howItFeels with the temperature for that hour to get how it feels
                how_it_feels = howItFeels(data.hourly.temperature_2m[i]); 
                //shortens time to only include the time not the date
                let time = data.hourly.time[i];
                let time_short = time.slice(11)               
                //creates a div with the data for each hour
                hourly_html += `<div class="hourly">`
                hourly_html += `<table>`
                hourly_html += `<tr>`
                hourly_html += `<th>${time_short}</th>`
                hourly_html += `<th>${data.hourly.temperature_2m[i]}${data.hourly_units.temperature_2m}</th>`
                hourly_html += `<th>${weather_codes[data.hourly.weathercode[i]]}</th>`
                hourly_html += `<th>${how_it_feels}</th>`
                hourly_html += `</tr>`
                hourly_html += `</table>`
                hourly_html += `</div>`
            }

            //runs updateHourlyWeather function with the html added the previous for loop
            updateHourlyWeather(hourly_html,date);
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
                daily_html += weather_images[data.daily.weathercode[i]]
                daily_html += `<p>High: ${data.daily.temperature_2m_max[i]}${data.daily_units.temperature_2m_max}</p>`
                daily_html += `<p>Low: ${data.daily.temperature_2m_min[i]}${data.daily_units.temperature_2m_min}</p>`
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
            let message = currentWeatherMessage(data.current_weather.temperature);

            let time_and_date = data.current_weather.time;
            //shortens time_and_date to only include the date not the time
            let date = time_and_date.slice(0,10)
            //shortens time_and_date to only include the time not the date
            let time = time_and_date.slice(11)    
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
            updateCurrentWeather((data.current_weather.temperature + data.daily_units.temperature_2m_max), (data.current_weather.windspeed + data.daily_units.windspeed_10m_max), (data.current_weather.winddirection + data.daily_units.winddirection_10m_dominant),  (relative_humidity + data.hourly_units.relativehumidity_2m), conditions_data, date, time, message, data.current_weather.temperature ,weather_images[data.current_weather.weathercode])
    

        })
        .catch(error => console.error('Error:', error))
}

//this function updates the HTML to display the current weather data
function updateCurrentWeather(temperature, windspead, winddirection, humidity, conditions, date, time, message,temperature_number,image) {
    // gets the elements that will be displaying the data from the API
    const main_img = document.getElementById("main-image");
    const current_date = document.getElementById("current_date");
    const current_temp = document.getElementById("current_temp");
    const current_windspeed = document.getElementById("current_windspeed");
    const current_winddirection = document.getElementById("current_winddirection");
    const temperature_message = document.getElementById("tempurature_message");
    let current_humidity = document.getElementById("current_humidity");
    let current_conditions = document.getElementById("current_conditions");
    //changes the inner html of the elements grabbed above to display the weather data grabbed in the fetchCurrentWeather function
    current_date.innerHTML = `
    <p>${time}</p>
    <p>${date}</p>
    `
    main_img.innerHTML = image;
    tempurature_message.innerHTML = message;
    current_windspeed.innerHTML = `<p>Wind speed: ${windspead}</p>`
    current_winddirection.innerHTML = `<p>Wind direction: ${winddirection}</p>`
    current_temp.innerHTML = `<p>${temperature}</p>`
    current_humidity.innerHTML = `<p>Humidity: ${humidity}</p>`
    current_conditions.innerHTML = `<p>Conditions: ${conditions}</p>`

    changeTheme(temperature_number)
}

//updates the daily weather section using html created in the fetchDailyWeather function
function updateDailyWeather(html) {
    const weekly_report = document.getElementById("weekly-report");

    weekly_report.innerHTML = html
}

//updates the hourly weather section using html created in the fetchHourlyWeather function and the date
function updateHourlyWeather(html,date) {
    const Hourly_report = document.getElementById("Hourly-report");
    const hourly_date = document.getElementById("hourly_date");
    hourly_date.innerHTML = `<p>Hourly Forecast for ${date}</p>`
    Hourly_report.innerHTML = html
}

//returns how it feels based of what the temperature is 
function howItFeels(temperature) {
    let temperature_feels;
    if (temperature >= 30){
        temperature_feels = 'Super F*ckin Hot'
    }
    else if (temperature >= 20 && temperature <30){
        temperature_feels = 'F*ckin Hot'
    }
    else if (temperature >= 15 && temperature <20){
        temperature_feels = 'Warm'
    }
    else if (temperature >= 0 && temperature <=15){
        temperature_feels = 'Warm IG'
    }
    else if (temperature > -15 && temperature <=0){
        temperature_feels = 'Cold'
    }
    else if (temperature > -25 && temperature <=-15){
        temperature_feels = 'F*ckin Cold'
    }
    else if (temperature <= -25){
        temperature_feels = 'Supper F*ckin Cold'
    }
    else{
        temperature_feels = 'IDK You Check'
    }
    return temperature_feels
}

function currentWeatherMessage(temperature) {
    let temperature_message;
    if (temperature >= 15){
        temperature_message = "Loose The Layers It's Hot As Sh*t"

    }
    else if (temperature >= 0 && temperature <15){
        temperature_message = "Wow It's Actually tolerable"
    }
    else if (temperature > -15 && temperature <=0){
        temperature_message = "Get a Sweater it F*ckin Chilly"
    }
    else if (temperature <= -15){
        temperature_message = "Bundle Up It's Cold As Sh*t"
    }
    else{
        temperature_message = 'IDK You Check'
    }
    return temperature_message
}

//changes color theme based on temperature
function changeTheme(temperature) {
    const body = document.getElementById('body');

    if (temperature >= 10){
    
        body.setAttribute("class", "hot")
    }
    else if (temperature >= -5 && temperature < 10){
        body.setAttribute("class", "default")
    }
    else if (temperature <= -5){
        body.setAttribute("class", "freezing")
    }
    else{
        body.setAttribute("class", "default")
    }
}


//this function is run when the user changes the city
//it runs the all the fetch functions using the API url for that city
async function changeCityWeather() {
    let city = document.getElementById("city")
    let cityValue = city.value;

    const current_city = document.getElementById("current_city");
    let content_div = document.getElementById('main_content');
    let warning_div = document.getElementById('warning');
    
    
    //fetches data for regina if the user selects regina
    if (cityValue == "regina") {
        current_city.innerHTML = `<p>Regina</p>`
        await fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=-104.62&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')


        await fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=-104.624&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')


        await fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=-104.62&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');

        content_div .setAttribute("class", "visible")
        warning_div .setAttribute("class", "hidden")
    }
    //fetches data for saskatoon if the user selects saskatoon
    else if (cityValue == "saskatoon") {
        current_city.innerHTML = `<p>Saskatoon</p>`
        await fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=52.14&longitude=-106.64&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')

        await fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=52.14&longitude=-106.64&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')

        await fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=52.14&longitude=-106.64&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');

        content_div .setAttribute("class", "visible")
        warning_div .setAttribute("class", "hidden")
    }
    //fetches data for prince albert if the user selects prince albert
    else if (cityValue == "prince_albert") {
        current_city.innerHTML = `<p>Prince Albert</p>`
        await fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=53.20&longitude=-105.75&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')


        await fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=53.20&longitude=-105.75&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')


        await fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=53.20&longitude=-105.75&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');

        content_div .setAttribute("class", "visible")
        warning_div .setAttribute("class", "hidden")
    }
    //fetches data for moose jaw if the user selects moose jaw
    else if (cityValue == "moose_jaw") {
        current_city.innerHTML = `<p>Moose Jaw</p>`
        await fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=50.39&longitude=-105.53&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')


        await fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.39&longitude=-105.53&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')


        await fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.39&longitude=-105.53&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');

        content_div .setAttribute("class", "visible")
        warning_div .setAttribute("class", "hidden")
    }
    //fetches data for swift current if the user selects swift current
    else if (cityValue == "swift_current") {
        current_city.innerHTML = `<p>Swift Current</p>`
        await fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=50.28&longitude=-107.79&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')


        await fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.28&longitude=-107.79&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')


        await fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=50.28&longitude=-107.79&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');

        content_div .setAttribute("class", "visible")
        warning_div .setAttribute("class", "hidden")
    }
    //fetches data for northbattleford if the user selects north battleford
    else if (cityValue == "north_battleford") {
        current_city.innerHTML = `<p>North Battleford</p>`
        await fetchCurrentWeather('https://api.open-meteo.com/v1/forecast?latitude=52.77&longitude=-108.29&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST&hourly=relativehumidity_2m')


        await fetchDailyWeather('https://api.open-meteo.com/v1/forecast?latitude=52.77&longitude=-108.29&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=CST')


        await fetchHourlyWeather('https://api.open-meteo.com/v1/forecast?latitude=52.77&longitude=-108.29&hourly=temperature_2m,relativehumidity_2m,winddirection_10m,weathercode&timezone=CST');

        content_div .setAttribute("class", "visible")
        warning_div .setAttribute("class", "hidden")

    }
}
