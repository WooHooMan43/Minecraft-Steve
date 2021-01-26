const Discord = require('discord.js');

module.exports = {
	name: 'adminhelp',
	description: "this is a help command!",
	execute(message, args){
		if (args.length == 0) {
			const embed = new Discord.MessageEmbed().setColor(0x883C88).setTitle('Advanced Help').addFields({name: '!points help', value: 'View or modify someone\'s points.', inline: true},{name: '!config help', value: 'View or modify the config.', inline: true},{name: '!ban [@User] [Reason]', value: 'Ban a user from the server.', inline: true},{name: '!unban [@User] [Reason]', value: 'Unban a user from the server.', inline: true},{name: '!kick [@User] [Reason]', value: 'Kick a user from the server.', inline: true},{name: '!clearchat [Value]', value: 'Delete a number of messages.', inline: true});
			message.reply(embed);
		}
	}
}
