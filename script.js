fetch("https://api.open-meteo.com/v1/forecast?latitude=45.52&longitude=-122.68&hourly=temperature_2m,&hourly=apparent_temperature,&daily=weather_code")
  .then(response => response.json())
  .then(data => {
    console.log("Weather data:", data);
  })
  .catch(error => {
    console.error("Error fetching weather:", error);
  });

const cityName = document.getElementById("cityInput").value;
const searchBtn = document.getElementById("citySearchBtn");

async function geocodeCity(cityName) {
  const apiKey = "3291f388f3ae486e8b2546f87a54b139";
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(cityName)}&apiKey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    return null;
  }
  const first = data.features[0].properties;
  return {
    lat: first.lat,
    lon: first.lon
  };
}

async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

searchBtn.addEventListener("click", async () => {
  const cityName = document.getElementById("cityInput").value;
  const location = await geocodeCity(cityName);
  if (!location) {
    alert("City not found");
    return;
  }
  const weatherData = await getWeather(location.lat, location.lon);

  document.getElementById("coordinates").textContent = "";
  const currentLat = document.createElement("li");
  currentLat.textContent = `Latitude: ${location.lat}`;
  document.getElementById("coordinates").appendChild(currentLat);

  const currentLon = document.createElement("li");
  currentLon.textContent = `Longitude: ${location.lon}`;
  document.getElementById("coordinates").appendChild(currentLon);
  
  // Display current weather information
  document.getElementById("weatherInfo").textContent = "";
  const currentDate = document.createElement("li");
  currentDate.textContent = `Current Date: ${new Date().toLocaleDateString()}`;
  document.getElementById("weatherInfo").appendChild(currentDate);

  const currentTemp = document.createElement("li");
  currentTemp.textContent = `Current Temperature: ${weatherData.hourly.temperature_2m[0]}°C`;
  document.getElementById("weatherInfo").appendChild(currentTemp);

  const humidity = document.createElement("li");
  humidity.textContent = `Humidity: ${weatherData.hourly.relative_humidity_2m[0]}%`;
  document.getElementById("weatherInfo").appendChild(humidity);

  const precipitationProp = document.createElement("li");
  precipitationProp.textContent = `Precipitation: ${weatherData.hourly.precipitation_probability[0]}%`;
  document.getElementById("weatherInfo").appendChild(precipitationProp);

  function interpretWeatherCode(code) {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if (code === 51 || code === 53 || code === 55) return "Drizzle";
  if (code === 56 || code === 57) return "Freezing drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rain";
  if (code === 66 || code === 67) return "Freezing rain";
  if (code === 71 || code === 73 || code === 75) return "Snowfall";
  if (code === 77) return "Snow grains";
  if (code === 80 || code === 81 || code === 82) return "Rain showers";
  if (code === 85 || code === 86) return "Snow showers";
  if (code === 95) return "Thunderstorm";
  if (code === 96 || code === 99) return "Thunderstorm with hail";
  return "Unknown weather";
  }
 
  const weatherCode = document.createElement("li");
  weatherCode.textContent = `Weather Code: ${weatherData.daily.weather_code[0]} - ${interpretWeatherCode(weatherData.daily.weather_code[0])}`;
  document.getElementById("weatherInfo").appendChild(weatherCode);

// Display 7-day forecast
  document.getElementById("forecastInfo").textContent = "";
   for (let i = 0; i < 7; i++) {
    const forecastItem = document.createElement("li");
    const date = new Date();
    date.setDate(date.getDate() + i);
    const code = weatherData.daily.weather_code[i];
    const maxTemp = weatherData.daily.temperature_2m_max[i];
    const minTemp = weatherData.daily.temperature_2m_min[i];
    forecastItem.textContent =
      `${date.toLocaleDateString()}: ${interpretWeatherCode(code)}, ` +
      `High: ${maxTemp}°C, Low: ${minTemp}°C`;
    document.getElementById("forecastInfo").appendChild(forecastItem);
 }

let clearBtn = document.getElementById("clearBtn");

if (!clearBtn) {
  clearBtn = document.createElement("button");
  clearBtn.id = "clearBtn";
  clearBtn.textContent = "Clear";
  clearBtn.addEventListener("click", function () {
    document.getElementById("coordinates").textContent = "";
    document.getElementById("weatherInfo").textContent = "";
    document.getElementById("forecastInfo").textContent = "";
    clearBtn.remove();
  });
  document.body.appendChild(clearBtn);
}
})


