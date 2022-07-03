const { Client, Guild } = require("discord.js");
// const settingsModel = require("../../models/settingsSchema");

/**
 * @param {Client} client
 * @param {Guild} guild
 */
module.exports = (client, guild) => {
	// let server = settingsModel.findOneAndRemove({ serverID: guild.id });

	console.log(
		`[${new Date().toISOString()}] Steve has been removed from '${guild.name}'.`
	);
};
