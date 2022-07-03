const { Client, Message } = require("discord.js");
const levelup = require("levelup");
const leveldown = require("leveldown");
const { encode, decode } = require("../../utils");

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
	if (message.author.bot) return;

	// @ts-ignore
	var guildDB = levelup(leveldown("./guilds"));
	// @ts-ignore
	var userDB = levelup(leveldown("./users"));

	guildDB
		.get(message.guildId)
		.then((g) => {
			userDB
				.get(`${message.guildId}-${message.author.id}`)
				.then((u) => {
					const guild = decode(g);
					let user = decode(u);
					user.bank += guild.currency.increment;
					userDB.put(`${message.guildId}-${message.author.id}`, encode(user));
				})
				.catch((err) => {
					userDB.put(
						`${message.guildId}-${message.author.id}`,
						encode({
							bank: 0,
							inventory: [],
						})
					);
				})
				.finally(() => userDB.close());
		})
		.catch((err) => {
			guildDB.put(
				message.guildId,
				encode({
					address: "play.woohoocraft.net",
					currency: {
						name: "Diamonds",
						symbol: "💎 ",
						increment: 1,
					},
				})
			);
		})
		.finally(() => guildDB.close());

	// const serverData = await settingsModel.findOne({ serverID: message.guild.id });
	// if (serverData == null) {
	// 	serverData = await settingsModel.create({serverID: message.guild.id});
	// 	serverData.save();
	// }

	// const profileData = await profileModel.findOne({ userID: message.author.id, serverID: message.guild.id });
	// if (profileData == null) {
	// 	profileData = await profileModel.create({userID: message.author.id, serverID: message.guild.id});
	// 	profileData.save();
	// }

	// const muted_users = serverData.MutedMembers;
	// const banned_words = serverData.BannedWords;
	// const increment = serverData.PointsIncrement;

	// const checkMessage = (word) => { // Check the message for bad words thoroughly
	// 	let AllChars = [];
	// 	for (let i = 97; i < 123; i++) AllChars.push(String.fromCharCode(i));
	// 	let stripped_message = message.content.toLowerCase().replace(/[^a-z]/g, '');
	// 	if (stripped_message.includes(word)) return true;
	// 	for (let i = 0; i < AllChars.length; i++) {
	// 		let stripped_message_check = stripped_message;
	// 		let restripped_message = stripped_message_check.split(AllChars[i]).join('');
	// 		if (restripped_message.includes(word)) return true;
	// 	};
	// 	return false;
	// };

	// if (message.author.bot) return; // Dont do any of this for a bot
	// else if (muted_users.includes(message.author.id) || banned_words.some(word => checkMessage(word))) {
	// 	message.delete().then(deletedMessage => console.log(`Deleted ${deletedMessage.author.tag}'s message in '${deletedMessage.guild.name}'.`));
	// 	return;
	// } else {
	// 	const response = await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $inc: { bank: increment }});
	// 	return;
	// };
};
