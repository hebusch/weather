const { Configuration, OpenAIApi } = require("openai");
const { MessageMedia } = require('whatsapp-web.js');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateImage(prompt) {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating image: ', error);
    return "No se ha podido procesar la solicitud.";
  }
}

async function askGPT(prompt) {
  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    return chatCompletion.data.choices[0].message.content;  
  } catch (error) {
    return "No se ha podido procesar la solicitud.";
  }
}

async function gptImage(message, client) {
  try {
    const parts = message.body.split(' ');
    if (parts.length < 2) {
      return;
    }
    const prompt = parts.slice(1).join(' ');
    const response = await generateImage(prompt);
    const media = await MessageMedia.fromUrl(response);
    if (message.fromMe) {
      client.sendMessage(message.to, media);
    } else {
      const chat = await message.getChat();
      const contact = await message.getContact();
      await chat.sendMessage(media, { 
        caption: `@${contact.id.user}`,
        mentions: [contact],
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function gptResponse(message, client) {
  try {
    const parts = message.body.split(' ');
    if (parts.length < 2) {
      return;
    }
    const prompt = parts.slice(1).join(' ');
    const response = await askGPT(prompt);
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

module.exports = { gptResponse, gptImage };