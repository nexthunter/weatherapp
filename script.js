// ACCESSING ALL THE HTML COMPONENTS REQUIRED TO PERFORM ACTIONS ON.
let button = document.querySelector('.button')
let inputvalue = document.querySelector('.inputValue')
let nameVal = document.querySelector('.name');
let temp = document.querySelector('.temp');
let desc = document.querySelector('.desc');

// Initialize the map
const map = L.map('map').setView([20, 0], 2); // Default view (world map)

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// OpenWeatherMap API key (replace with your own key)
const apiKey = 'c628b93a28534d678a8a8e60dacfc1a3';

// Function to fetch weather data
async function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Add a click event to the map
map.on('click', async (e) => {
    const { lat, lng } = e.latlng;

    // Fetch weather data for the clicked location
    const weather = await getWeather(lat, lng);

    // Display weather information
    document.querySelector('.temp').textContent = `${weather.main.temp}°C`;
    document.querySelector('.desc').textContent = weather.weather[0].description;

    // Add a marker to the map
    L.marker([lat, lng]).addTo(map)
        .bindPopup(`Weather: ${weather.weather[0].description}<br>Temperature: ${weather.main.temp}°C`)
        .openPopup();
});

// Search functionality
document.querySelector('.button').addEventListener('click', async () => {
    const location = document.querySelector('.inputValue').value;

    // Use a geocoding API to get coordinates for the location
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.length > 0) {
        const { lat, lon } = data[0];

        // Center the map on the searched location
        map.setView([lat, lon], 10);

        // Fetch weather data for the searched location
        const weather = await getWeather(lat, lon);

        // Display weather information
        document.querySelector('.temp').textContent = `${weather.main.temp}°C`;
        document.querySelector('.desc').textContent = weather.weather[0].description;

        // Add a marker to the map
        L.marker([lat, lon]).addTo(map)
            .bindPopup(`Weather: ${weather.weather[0].description}<br>Temperature: ${weather.main.temp}°C`)
            .openPopup();
    } else {
        alert('Location not found!');
    }
});

