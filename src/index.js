const client = require('./client');
const weatherResponse = require('./cmds/weather');
const { gptResponse, gptImage } = require('./cmds/openai');
const fastq = require('fastq');

function taskHandler(message, cb) {
  console.log('Procesando mensaje:', message.body);

  if (message.body.toLowerCase().startsWith('/ask')) {
    gptResponse(message, client)
      .then(() => {
        console.log('gptResponse procesado con éxito.');
        cb();
      })
      .catch(error => {
        console.error('Error en gptResponse:', error);
        cb(error);
      });
  } 
  else if (message.body.toLowerCase().startsWith('/img')) {
    gptImage(message, client)
      .then(() => {
        console.log('gptImage procesado con éxito.');
        cb();
      })
      .catch(error => {
        console.error('Error en gptImage:', error);
        cb(error);
      });
  } 
  else if (message.body.toLowerCase().startsWith('weather')) {
    weatherResponse(message, client)
      .then(() => {
        console.log('weatherResponse procesado con éxito.');
        cb();
      })
      .catch(error => {
        console.error('Error en weatherResponse:', error);
        cb(error);
      });
  } 
  else {
    console.log('Mensaje no reconocido:', message.body);
    cb();
  }
}

const queue = fastq.promise(taskHandler, 1);

client.on('message_create', async (message) => {
  console.log('Mensaje recibido:', message.body);
  queue.push(message);
});
