const axios = require('axios');
require('dotenv').config();

function todayDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}

async function getHoroscope(sign) {
  try {
    const date = todayDate();
    const url = `https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test?sign=${sign}&date=${date}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${process.env.HOROSCOPE_API_KEY}`
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return "No se ha podido procesar la solicitud.";
  }
}

getHoroscope('aries').then(data => console.log(data));
