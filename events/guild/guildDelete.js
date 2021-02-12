// Require modules
const fs = require('fs');

module.exports = (Discord, client, guild) => {
	// Delete guild
	fs.rmdirSync(`./guilds/${guild.id}`)

	console.log(`Steve has been removed from '${guild.name}'.`);
}