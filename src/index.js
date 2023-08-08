const client = require('./client');
const getWeather = require('./weather');

client.on('message_create', async (message) => {
    if (message.body.toLowerCase().startsWith('weather')) {
        const parts = message.body.split(' ');
        if (parts.length < 2) {
            return;
        }
        const cityName = parts.slice(1).join(' ');
        const weatherInfo = await getWeather(cityName);
        if (message.fromMe) {
            client.sendMessage(message.to, weatherInfo);    
        } else {
            const chat = await message.getChat();
            const contact = await message.getContact();
            await chat.sendMessage(`@${contact.id.user}, ${weatherInfo}`, {
                mentions: [contact]
            });    
        }
    }
});
