const APIkey = "965c13a85e2a29ffaffff934e7249830";
let city;

document.getElementById("search-button").addEventListener("click", function () {
    city = document.getElementById("city-search").value;
    getWeatherData(city);
});

function getWeatherData(city) {
    // Make a fetch call to the OpenWeatherMap API for current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            // Update the UI with the current weather data
            updateCurrentWeather(data);

            // Fetch the 5-day forecast
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}&units=metric`);
        })
        .then(response => response.json())
        .then(forecastData => {
            // Update the UI with the 5-day forecast
            update5DayForecast(forecastData);
            
            // Add the city to the search history
            addToHistory(city);
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

function update5DayForecast(forecastData) {
    const forecastContainer = document.getElementById("five-day-container");
    forecastContainer.innerHTML = '';


    const dailyForecasts = forecastData.list.filter((item, index) => index % 8 === 0);

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000); // Convert timestamp to date
        const icon = forecast.weather[0].icon;
        
        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");
        forecastCard.innerHTML = `
            <p>Date: ${date.toLocaleDateString()}</p>
            <p>Temperature: ${forecast.main.temp} °C</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
            <p>Wind Speed: ${forecast.wind.speed} m/s</p>
            <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
        `;

        forecastContainer.appendChild(forecastCard);
    });
}

function updateCurrentWeather(data) {
    const currentSection = document.getElementById("current");
    currentSection.innerHTML = `
        <h2>${data.name}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function addToHistory(city) {
    const historySection = document.getElementById("history");
    const cityButton = document.createElement("button");
    cityButton.textContent = city;
    cityButton.addEventListener("click", function () {
        getWeatherData(city);
    });
    historySection.appendChild(cityButton);
}

