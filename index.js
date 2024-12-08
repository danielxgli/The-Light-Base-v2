const {GatewayIntentBits, Client, Partials} = require('discord.js')
const client = new Client({ intents: Object.keys(GatewayIntentBits), partials: Object.keys(Partials) });
const fs = require('node:fs')

const handlers = fs.readdirSync('./handlers').filter(file => file.endsWith(".js"));

for (const file of handlers) {
    require(`./handlers/${file}`)(client);
}


const { token } = require('./config.json')
const colors = require('colors')

console.log(`Logging bot...`.yellow)
client.login(token) 