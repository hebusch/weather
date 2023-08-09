const client = require('./client');
const weatherResponse = require('./cmds/weather');
const gptResponse = require('./cmds/openai');
const horoscopeResponse = require('./cmds/horoscopo');

client.on('message_create', async (message) => {
  if (message.body.startsWith('/ask')) {
    await gptResponse(message, client);
  }

  if (message.body.toLowerCase().startsWith('weather')) {
    await weatherResponse(message, client);
  }

  if (message.body.toLowerCase().startsWith('/horoscopo')) {
    await horoscopeResponse(message, client);
  }
});
