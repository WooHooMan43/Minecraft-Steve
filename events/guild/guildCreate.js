// Require modules
const { initializeGuild } = require('../../functions');

module.exports = (Discord, client, guild) => {
	// Initialize guild
	initializeGuild(guild);

	console.log(`Steve has been added to '${guild.name}'.`);
}