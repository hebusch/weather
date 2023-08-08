const client = require('./client');
const weatherResponse = require('./weather');
const gptResponse = require('./openai');

client.on('message_create', async (message) => {
  if (message.body.startsWith('/ask')) {
    await gptResponse(message, client);
  }

  if (message.body.toLowerCase().startsWith('weather')) {
    await weatherResponse(message, client);
  }
});
