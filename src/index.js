const client = require('./client');
const weatherResponse = require('./cmds/weather');
const { gptResponse, gptImage } = require('./cmds/openai');
const fastq = require('fastq');

async function taskHandler(message) {
  try {
    if (message.body.toLowerCase().startsWith('/ask')) {
      await gptResponse(message, client);
    } else if (message.body.toLocaleLowerCase().startsWith('/img')) {
      await gptImage(message, client);
    } else if (message.body.toLowerCase().startsWith('weather')) {
      await weatherResponse(message, client);
    }
  } catch (error) {
    console.error('Error en taskHandler:', error);
    throw error;
  }
}

const queue = fastq.promise(taskHandler, 3);

client.on('message_create', async (message) => {
  queue.push(message);
});
