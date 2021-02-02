const fs = require('fs');

const { initializeGuild } = require('./../../functions');

module.exports = (Discord, client, guild) => {
	initializeGuild(guild);

    console.log(`Steve has been added to '${guild.name}'.`);
}