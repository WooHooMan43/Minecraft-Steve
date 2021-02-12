// Require modules
const fs = require('fs');

const { checkMessage } = require('../../functions');

module.exports = (Discord, client, message) => {	
	// Show that the bot is 'Playing Minecraft'
	client.user.setPresence({
		activity: {
			name: "Minecraft",
			type: 0
		}
	});
	
	const replyEmbed = new Discord.MessageEmbed(); // Create an essentially global embed

	const prefix = '!'

	// Get all the muted users
	let muted_users_raw = fs.readFileSync(`guilds/${message.guild.id}/muted_users.json`)
	let muted_users = JSON.parse(muted_users_raw);

	if (muted_users.includes(message.author.id)) { // Delete muted user's message
		message.delete().then(msg => console.log(`Deleted ${msg.author.tag}'s message in '${msg.guild.name}' because they are muted.`));
		return
	} else if (!message.content.startsWith(prefix) && !message.author.bot) { // Check the message for banned words and add points
		checkMessage(message);
		return
	} else if (message.author.bot) return; // But dont do any of that for a bot
	
	// Get command and the args given
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase()

	try { // Do it and hope it works
		client.commands.get(command).execute(client, message, args, Discord, replyEmbed).then(code => {
			if (code == 'Good') return; // All good
			else if (code == 'Permission') message.reply(replyEmbed.setColor(0x0FF000).setTitle('No Permission').setDescription("You do not have permission to use this command.")); // User has no permission
			else if (code == 'Unknown') message.reply(replyEmbed.setColor(0x0FF000).setTitle('Unknown Command').setDescription(`'${message}' is an unknown command. Check your spelling/syntax.`)); // Unknown command
		})
	} catch (error) { // Dont if it doesnt
		console.error(error);
		message.reply(replyEmbed.setColor(0x0FF000).setTitle('Unknown Command').setDescription(`'${message}' is an unknown command. Check your spelling/syntax.`));
	}
}