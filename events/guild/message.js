// Require modules
const profileModel = require('../../models/profileSchema');

const settingsModel = require('../../models/settingsSchema');

module.exports = async (Discord, client, message) => {	
	// Show that the bot is 'Playing Minecraft'
	client.user.setPresence({
		activity: {
			name: 'Minecraft',
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
		profileData = await profileModel.findOne({ userID: message.author.id, serverID: message.guild.id });
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

	const cooldowns = profileData.cooldowns

	// Get command and the args given
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = client.commands.get(args.shift().toLowerCase());

	const data = [serverData, profileData];

	checkMessage = (word) => { // Check the message for bad words thoroughly
		let AllChars = [];
		for (let i = 97; i < 123; i++) AllChars.push(String.fromCharCode(i));
		let stripped_message = message.content.toLowerCase().replace(/[^a-z]/g, '');
		if (stripped_message.includes(word)) return true;
		for (let i = 0; i < AllChars.length; i++) {
			let stripped_message_check = stripped_message;
			let restripped_message = stripped_message_check.split(AllChars[i]).join('');
			if (restripped_message.includes(word)) return true;
		};
		return false;
	};

	// Assorted Checking Logic (Muted, Banned Words, Cooldowns)
	if (message.author.bot) return; // Dont do any of this for a bot
	else if (muted_users.includes(message.author.id) || (!message.content.startsWith('!') && banned_words.some(word => checkMessage(word)))) { // Delete muted user's message
		message.delete().then(deletedMessage => console.log(`Deleted ${deletedMessage.author.tag}'s message in '${deletedMessage.guild.name}'.`));
		return;
	} else if (!message.content.startsWith(prefix)) { // Check the message for banned words and give money
		const response = await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $inc: { bank: increment }});
		return;
	};
	if (cooldowns.includes(command.name)) { // Is it already cooling down?
		message.reply(replyEmbed.setColor(0x0FF000).setTitle('Cooldown').setDescription('Wait to execute this command.'));
		return;
	} else { // Add it to the cooldowns
		const cooldown_amount = (command.cooldown) * 1000;
		const response = await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $push: { cooldowns: command.name }}, { new: true });
		setTimeout(async function() {
			await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $pull: { cooldowns: command.name }});
		}, cooldown_amount)
	};

	try { // Do it and hope it works
		command.execute(client, message, args, Discord, replyEmbed, data) // Run it
		.then(code => { // Get the exit code
			if (code == 'Good') return; // All good
			else if (code == 'Permission') message.reply(replyEmbed.setColor(0x0FF000).setTitle('No Permission').setDescription('You do not have permission to use this command.')); // User has no permission
			else if (code == 'Unknown') message.reply(replyEmbed.setColor(0x0FF000).setTitle('Unknown Command').setDescription(`'${message}' is an unknown command. Check your spelling/syntax.`)); // Unknown command
		})
	} catch (error) { // Dont if it doesnt
		console.error(error);
		message.reply(replyEmbed.setColor(0x0FF000).setTitle('Unknown Command').setDescription(`'${message}' is an unknown command. Check your spelling/syntax.`));
	}
}