// Require modules
const profileModel = require('../../models/profileSchema');

const settingsModel = require('../../models/settingsSchema');

module.exports = async (Discord, client, message) => {	
	// Show that the bot is 'Playing Minecraft'
	client.user.setPresence({
		activity: {
			name: "Minecraft",
			type: 0
		}
	});
	
	const replyEmbed = new Discord.MessageEmbed(); // Create an essentially global embed

	let serverData;
	try {
		serverData = await settingsModel.findOne({ serverID: message.guild.id });
		if (!serverData) {
			let server = await settingsModel.create({
				serverID: message.guild.id
			});
			server.save();
		}
	} catch (err) {
		console.error(err);
	};

	let profileData;
	try {
		profileData = await profileModel.findOne({ userID: message.author.id });
		if (!profileData) {
			let profile = await profileModel.create({
				userID: message.author.id,
				serverID: message.guild.id
			});
			profile.save();
		}
	} catch (err) {
		console.error(err);
	};

	const prefix = serverData.Prefix;
	const muted_users = serverData.MutedMembers;
	const banned_words = serverData.BannedWords;
	const increment = serverData.PointsIncrement;
	
	if (muted_users.includes(message.author.id) || banned_words.some(word => message.content.replace(/[^a-zA-Z]/g, "").toLowerCase().includes(word) )) { // Delete muted user's message
		message.delete().then(msg => console.log(`Deleted ${msg.author.tag}'s message in '${msg.guild.name}'.`));
		return
	} else if (!message.content.startsWith(prefix) && !message.author.bot) { // Check the message for banned words and add points
		const response = await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $inc: { coins: increment }});
		return
	} else if (message.author.bot) return; // But dont do any of that for a bot
	
	// Get command and the args given
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	const data = [serverData, profileData];

	try { // Do it and hope it works
		client.commands.get(command).execute(client, message, args, Discord, replyEmbed, data) // Run it
		.then(code => { // Get the exit code
			if (code == 'Good') return; // All good
			else if (code == 'Permission') message.reply(replyEmbed.setColor(0x0FF000).setTitle('No Permission').setDescription("You do not have permission to use this command.")); // User has no permission
			else if (code == 'Unknown') message.reply(replyEmbed.setColor(0x0FF000).setTitle('Unknown Command').setDescription(`'${message}' is an unknown command. Check your spelling/syntax.`)); // Unknown command
		})
	} catch (error) { // Dont if it doesnt
		console.error(error);
		message.reply(replyEmbed.setColor(0x0FF000).setTitle('Unknown Command').setDescription(`'${message}' is an unknown command. Check your spelling/syntax.`));
	}
}