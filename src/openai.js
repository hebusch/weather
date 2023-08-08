const { Configuration, OpenAI } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI(configuration);

async function askGPT(prompt) {
  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
  
    return chatCompletion;  
  } catch (error) {
    return "Hubo un error.";
  }
}

async function gptResponse(message) {
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

module.exports = gptResponse; 