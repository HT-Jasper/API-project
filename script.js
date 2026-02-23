fetch("https://api.open-meteo.com/v1/forecast?latitude=45.52&longitude=-122.68&hourly=temperature_2m,&hourly=apparent_temperature,&daily=weather_code")
  .then(response => response.json())
  .then(data => {
    console.log("Weather data:", data);
  })
  .catch(error => {
    console.error("Error fetching weather:", error);
  });
