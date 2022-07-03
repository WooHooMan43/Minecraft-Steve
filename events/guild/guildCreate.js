const { Client, Guild } = require("discord.js");
const levelup = require("levelup");
const leveldown = require("leveldown");
const { encode, decode } = require("../../utils");

/**
 * @param {Client} client
 * @param {Guild} guild
 */
module.exports = async (client, guild) => {
	// @ts-ignore
	var guildDB = levelup(leveldown("./guilds"));
	// @ts-ignore
	var userDB = levelup(leveldown("./users"));

	guildDB
		.get(guild.id)
		.then((value) => {})
		.catch((error) => {
			if (error && error.type == "NotFoundError") {
				guildDB.put(
					guild.id,
					encode({
						address: "play.woohoocraft.net",
						currency: {
							name: "Diamonds",
							symbol: "💎 ",
							increment: 1,
						},
					})
				);
			}
		});

	const members = await guild.members.fetch();
	for (const [_, member] of members) {
		userDB
			.get(`${guild.id}-${member.user.id}`)
			.then((value) => {})
			.catch((error) => {
				if (error && error.type == "NotFoundError") {
					userDB.put(
						`${guild.id}-${member.user.id}`,
						encode({
							bank: 0,
							inventory: [],
						})
					);
				}
			});
	}

	guildDB.close();
	userDB.close();

	console.log(
		`[${new Date().toISOString()}] Steve has been added to '${guild.name}'.`
	);
};
