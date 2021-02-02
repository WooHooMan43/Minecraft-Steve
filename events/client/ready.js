const fs = require('fs');

const { initializeGuild } = require('./../../functions');

module.exports = (Discord, client) => {
	client.user.setPresence({
		activity: {
			name: "Minecraft",
			type: 0
		}
	});

	fs.mkdirSync('guilds', {recursive: true});
	client.guilds.cache.forEach(guild => {
        initializeGuild(client, guild);
	});
	console.log('Steve is online!');
}