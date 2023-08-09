const client = require('./client');
const weatherResponse = require('./cmds/weather');
const { gptResponse, gptImage } = require('./cmds/openai');
// const horoscopeResponse = require('./cmds/horoscopo');

client.on('message_create', async (message) => {
  if (message.body.toLowerCase().startsWith('/ask')) {
    gptResponse(message, client).catch(error => console.error('Error in gptResponse:', error));
  }

  if (message.body.toLocaleLowerCase().startsWith('/img')) {
    gptImage(message, client).catch(error => console.error('Error in gptImage:', error));
  }

  if (message.body.toLowerCase().startsWith('weather')) {
    weatherResponse(message, client).catch(error => console.error('Error in weatherResponse:', error));
  }

  // if (message.body.toLowerCase().startsWith('/horoscopo')) {
  //   await horoscopeResponse(message, client);
  // }
});
