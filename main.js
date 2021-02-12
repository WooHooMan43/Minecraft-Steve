// Require modules
const Discord = require('discord.js');

require('dotenv').config();

// Create client
const client = new Discord.Client();

// Create collections for commands and events
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

// require each handler
['command_handler','event_handler'].forEach(handler => {
	require(`./handlers/${handler}`)(client, Discord);
})

// LEAVE AT END
client.login(process.env.DISCORD_TOKEN);
