const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: "this is a help command!",
	execute(message, args){
		if (args.length == 0) {
			const embed = new Discord.MessageEmbed().setColor(0x883C88).setTitle('Help').addFields({name: '!help', value: 'Displays the help menu.', inline: true},{name: '!status', value: 'Displays the status of the Minecraft server.', inline: true},{name: '!points [help/user/add/remove/reset]', value: 'Get help or view or modify your or someone else\'s points.', inline: true},{name: '!config [help/server/adminroles/userexceptions]', value: 'Get help or modify the config.', inline: true});
			message.reply(embed);
		}
	}
}
