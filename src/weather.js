const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function getWeather(city) {
  try {
    const cityFormatted = city.split(' ').join('%20');
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${cityFormatted}&lang=es`
    );
    const data = response.data;
    const cityResponse = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
    return `${cityResponse}\n${data.current.condition.text}\nAhora: ${data.current.temp_c}°C\nMax: ${data.forecast.forecastday[0].day.maxtemp_c}°C\nMin: ${data.forecast.forecastday[0].day.mintemp_c}°C\nProb de lluvia: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
  } catch (error) {
    return `No se pudo obtener el clima de ${city}`;
  }
}

module.exports = getWeather;