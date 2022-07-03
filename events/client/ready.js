const { Client } = require("discord.js");
const levelup = require("levelup");
const leveldown = require("leveldown");
const { encode, decode, getCommands } = require("../../utils");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
	if (!client.user) return;

	console.log(`[${new Date().toISOString()}] Loading databases...`);

	const guilds = await client.guilds.fetch();

	// @ts-ignore
	var guildDB = levelup(leveldown("./guilds"));
	// @ts-ignore
	var userDB = levelup(leveldown("./users"));

	for (const [_, g] of guilds) {
		const guild = await g.fetch();

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
	}

	// Wait to close the databases because its a little too fast lol
	setTimeout(() => {
		guildDB.close();
		userDB.close();
	}, 1000);

	console.log(`[${new Date().toISOString()}] Loading commands...`);

	const commands = getCommands();

	client.guilds.cache.forEach(async (guild) => {
		let guild_commands = await guild.commands.fetch();

		commands.forEach(async (command) => {
			let guild_command = guild_commands.find(
				(guild_command) => guild_command.name == command.data.name
			);

			if (guild_command) await guild_command.edit(command.data);
			else await guild.commands.create(command.data);
		});

		guild_commands.forEach(async (guild_command) => {
			if (!commands.get(guild_command.name)) {
				guild.commands.delete(guild_command.id);
			}
		});
	});

	// Set presence to 'Playing Minecraft'
	client.user.setPresence({
		status: "online",
		activities: [
			{
				name: "Minecraft",
				type: 0,
			},
		],
		afk: true,
	});

	// // Check for tempbans and tempmutes to end
	// setInterval(() => {
	// 	client.guilds.cache.forEach(async (guild) => {
	// 		let serverData = await settingsModel.findOne({ serverID: guild.id });
	// 		if (serverData == null) {
	// 			serverData = await settingsModel.create({serverID: guild.id});
	// 			serverData.save();
	// 		}

	// 		serverData.BannedMembers.forEach(async (ban) => {
	// 			if (Date.now() > ban.unban) {
	// 				guild.members.unban(ban.id);
	// 				const response = await settingsModel.findOneAndUpdate(
	// 					{ serverID: guild.id },
	// 					{ $pull: { BannedMembers: { id: { $in: ban.id } } } },
	// 					{ new: true }
	// 				);
	// 			}
	// 		});
	// 	})
	// }, 1 * 60 * 1000);

	console.log(`[${new Date().toISOString()}] Steve is online!`);
};
