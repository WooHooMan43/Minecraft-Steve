// Require modules
const settingsModel = require('../../models/settingsSchema');

module.exports = async (Discord, client, guild) => {
	let server = await settingsModel.create({
		serverID: guild.id
	});
	server.save();

	console.log(`Steve has been added to '${guild.name}'.`);
}