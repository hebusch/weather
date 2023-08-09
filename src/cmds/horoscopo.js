const axios = require('axios');
const translateText = require('../utils/translate');
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

async function horoscopeResponse(message, client) {
  try {
    const parts = message.body.split(' ');
    if (parts.length < 2) {
      return;
    }
    const sign = parts[1];
    const translatedSign = await translateText(sign, 'es', 'en');
    const response = await getHoroscope(translatedSign);
    const description = await translateText(response.description, 'en', 'es');
    const compatibility = await translateText(response.compatibility, 'en', 'es');
    const mood = await translateText(response.mood, 'en', 'es');
    const luckyNumber = response.lucky_number;
    const msg = `🔮 ${description}\nCompatibilidad: ${compatibility}\nHumor: ${mood}\nNúmero de la suerte: ${luckyNumber} 🌟`;
    if (message.fromMe) {
      client.sendMessage(message.to, msg);    
    } else {
      const chat = await message.getChat();
      const contact = await message.getContact();
      await chat.sendMessage(`@${contact.id.user}\n${msg}`, {
          mentions: [contact]
      });    
    }
  } catch (error) {
    console.log(error); 
  }
}

module.exports = horoscopeResponse;