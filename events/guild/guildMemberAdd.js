const { Client, GuildMember } = require("discord.js");
const levelup = require("levelup");
const leveldown = require("leveldown");
const { encode, decode } = require("../../utils");

/**
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
	// @ts-ignore
	var userDB = levelup(leveldown("./users"));
	userDB
		.get(`${member.guild.id}-${member.user.id}`)
		.then((value) => {})
		.catch((err) => {
			if (err && err.type == "NotFoundError") {
				userDB.put(
					`${member.guild.id}-${member.user.id}`,
					encode({
						bank: 0,
						inventory: [],
					})
				);
			}
		})
		.finally(() => userDB.close());
};
