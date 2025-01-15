/*
COMP125 - Client-Side Web Development

Assignment 4- Weather App
Author: Abdallah Divkar
Student-ID: 301302441
Date:   13/8/2024

Filename: script.js
*/

const apiKey = '49cc8c821cd2aff9af04c9f98c36eb74';

function getWeather() {
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    
    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp); // Temperature in Celsius
        const feelsLike = Math.round(data.main.feels_like); // Feels like temperature
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p style="font-size: 25px; padding: 10px;">${cityName}</p>
            <p></p>
            <p style="font-size: 25px; padding: 20px;">${description}</p>
        `;

        const humidityHTML = `
            <p id="humidity"><i class="fa-solid fa-droplet"></i> Humidity: ${data.main.humidity}%</p>
        `;

        const windSpeedHTML = `
            <p id="wind-speed"><i class="fa-solid fa-wind"></i> Wind Speed: ${data.wind.speed} m/s</p>
        `;

        const feelsLikeHTML = `
            <p id="feels-like"><i class="fa-solid fa-temperature-three-quarters"></i> Feels Like: ${feelsLike}°C</p>
        `;

        const pressureHTML = `
            <p id="pressure"><i class="fa-solid fa-weight-scale"></i> Pressure: ${data.main.pressure} hPa</p>
        `;

        tempDivInfo.innerHTML = weatherHtml + temperatureHTML;
        weatherInfoDiv.innerHTML = humidityHTML + windSpeedHTML + feelsLikeHTML + pressureHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;


        // Show the weather info div
        weatherInfoDiv.style.display = 'block';

        showImage();
    }
}


function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    hourlyForecastDiv.innerHTML = ''; // Clear existing HTML

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp); // Temperature in Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;

    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}

document.addEventListener("DOMContentLoaded", () => {
    const locationBtn = document.querySelector("#locationBtn");
    
    locationBtn.addEventListener("click", async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
                
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    
                    if (data.name) {
                        document.getElementById('city').value = data.name; // Set city input field
                        getWeather(); // Call getWeather without arguments
                    } else {
                        console.error("City name not found in the response.");
                    }
                } catch (error) {
                    console.error("Error fetching weather data:", error);
                }
            }, (error) => {
                console.error("Error getting location:", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    });
});

/*navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const timezoneOffset = position.timestamp - position.coords.timestamp; // in milliseconds
    const timezoneOffsetMinutes = timezoneOffset / 60000; // convert to minutes
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.name) {
        document.getElementById('city').value = data.name; // Set city input field
        getWeather(); // Call getWeather without arguments
  
        // Update the time zone
        const timeZone = data.timezone; // Get the time zone from the API response
        const currentTime = new Date(); // Get the current time
        const timeZoneOffset = currentTime.getTimezoneOffset() + timeZone * 60; // Calculate the time zone offset in minutes
        const localTime = new Date(currentTime.getTime() + timeZoneOffset * 60000); // Convert to local time
  
        // Update the time display
        const timeElement = document.getElementById('time');
        timeElement.innerText = localTime.toLocaleTimeString();
      } else {
        console.error("City name not found in the response.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, (error) => {
    console.error("Error getting location:", error);
});
*/