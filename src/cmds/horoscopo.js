const axios = require('axios');

function todayDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}

// WIP.
async function getHoroscope(sign) {
  try {
    const date = todayDate();
    const url = `https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test?sign=${sign}&date=${date}`;
    const response = await axios.get(url);
    console.log(response.data);
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
    const response = await getHoroscope(sign);
    if (message.fromMe) {
      client.sendMessage(message.to, response);    
    } else {
      const chat = await message.getChat();
      const contact = await message.getContact();
      await chat.sendMessage(`@${contact.id.user}, ${response}`, {
          mentions: [contact]
      });    
    }
  } catch (error) {
    console.log(error); 
  }
}

module.exports = horoscopeResponse;