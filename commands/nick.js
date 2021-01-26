const Discord = require('discord.js');

module.exports = {
	name: 'nick',
	description: "this is a nick command!",
	execute(message, args){
        if (args[0] != undefined) {
			message.member.setNickname(args.join(' '))
        }
	}
}
