const fs = require('fs');

module.exports = (Discord, client) => {
	const { initializeGuild } = require('./../../functions');

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