// Require modules
const Discord = require('discord.js');

require('dotenv').config();

const mongoose = require('mongoose');

// Create client
const client = new Discord.Client();

// Create collections for commands and events
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

// require each handler
['command_handler','event_handler'].forEach(handler => {
	require(`./handlers/${handler}`)(client, Discord);
});

mongoose.connect(process.env.MONGODB_SRV, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(() => {
	console.log(`Connected to`)
}).catch((err) => {
	console.error(err);
});

// LEAVE AT END
client.login(process.env.DISCORD_TOKEN);
