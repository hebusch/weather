const axios = require('axios');
require('dotenv').config();

async function translateText(text, from, to) {
  const options = {
    method: 'POST',
    url: 'https://text-translator2.p.rapidapi.com/translate',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': 'text-translator2.p.rapidapi.com'
    },
    data: new URLSearchParams({
      'source_language': from,
      'target_language': to,
      'text': text
    }),
  };

  try {
    const response = await axios.request(options);
    return response.data.data.translatedText;
  } catch (error) {
    console.error(error);
    throw new Error("No se ha podido procesar la solicitud.");
  }
}

module.exports = translateText;