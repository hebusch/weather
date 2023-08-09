const client = require('./client');
const weatherResponse = require('./cmds/weather');
const { gptResponse, gptImage } = require('./cmds/openai');
const fastq = require('fastq');

// Función de trabajo para la cola
function taskHandler(message, cb) {
  if (message.body.toLowerCase().startsWith('/ask')) {
    gptResponse(message, client).then(() => cb()).catch(error => {
      console.error('Error in gptResponse:', error);
      cb(error);
    });
  } else if (message.body.toLocaleLowerCase().startsWith('/img')) {
    gptImage(message, client).then(() => cb()).catch(error => {
      console.error('Error in gptImage:', error);
      cb(error);
    });
  } else if (message.body.toLowerCase().startsWith('weather')) {
    weatherResponse(message, client).then(() => cb()).catch(error => {
      console.error('Error in weatherResponse:', error);
      cb(error);
    });
  } else {
    cb();
  }
}

// Crea la cola con un worker y concurrencia 1
const queue = fastq.promise(taskHandler, 1);

client.on('message_create', async (message) => {
  queue.push(message);
});
