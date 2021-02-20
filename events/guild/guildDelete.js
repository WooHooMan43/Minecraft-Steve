// Require modules
const settingsModel = require('../../models/settingsSchema');

module.exports = (Discord, client, guild) => {
	let server = settingsModel.findOneAndRemove({ serverID: guild.id });

	console.log(`Steve has been removed from '${guild.name}'.`);
}