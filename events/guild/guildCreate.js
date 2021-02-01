const fs = require('fs');

module.exports = (Discord, client, guild) => {
	const { initializeGuild } = require('./../../functions');

	initializeGuild(guild);

    console.log(`Steve has been added to '${guild.name}'.`);
}