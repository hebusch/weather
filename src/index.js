const client = require('./client');
const weatherResponse = require('./cmds/weather');
const { gptResponse, gptImage } = require('./cmds/openai');
const fastq = require('fastq');

function taskHandler(message) {
  if (message.body.toLowerCase().startsWith('/ask')) {
    return gptResponse(message, client)
      .catch(error => {
        console.error('Error en gptResponse:', error);
        throw error;
      });
  } 
  else if (message.body.toLocaleLowerCase().startsWith('/img')) {
    return gptImage(message, client)
      .catch(error => {
        console.error('Error en gptImage:', error);
        throw error;
      });
  } 
  else if (message.body.toLowerCase().startsWith('weather')) {
    return weatherResponse(message, client)
      .catch(error => {
        console.error('Error en weatherResponse:', error);
        throw error;
      });
  } 
  else {
    return Promise.resolve();
  }
}

const queue = fastq.promise(taskHandler, 3);

client.on('message_create', async (message) => {
  queue.push(message);
});
