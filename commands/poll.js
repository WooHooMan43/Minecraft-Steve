const Discord = require('discord.js');

module.exports = {
	name: 'poll',
	description: "this is a poll command!",
	execute(message, args){
		const embed = new Discord.MessageEmbed().setColor(0xFFC300);

		var pollArgs = args.slice(1).join(' ').split(';');
		
		if (args[0] === 'YN'){
			embed.setTitle(pollArgs[0] + '?').setDescription('Vote 👍 or 👎')
			message.channel.send(embed).then(messageReaction => {
				messageReaction.react('👍');
				messageReaction.react('👎');
				message.delete({timeout: 50}).catch(console.error);
			})
		} else if (args[0] === '2') {
			embed.setTitle(pollArgs[0] + '?').setDescription(`1️⃣:${pollArgs[1]}\n2️⃣:${pollArgs[2]}`)
			message.channel.send(embed).then(messageReaction => {
				messageReaction.react('1️⃣');
				messageReaction.react('2️⃣');
				message.delete({timeout: 50}).catch(console.error);
			})
		} else if (args[0] === '3') {
			embed.setTitle(pollArgs[0] + '?').setDescription(`1️⃣:${pollArgs[1]}\n2️⃣:${pollArgs[2]}\n3️⃣:${pollArgs[3]}`)
			message.channel.send(embed).then(messageReaction => {
				messageReaction.react('1️⃣');
				messageReaction.react('2️⃣');
				messageReaction.react('3️⃣');
				message.delete({timeout: 50}).catch(console.error);
			})
		} else if (args[0] === '4') {
			embed.setTitle(pollArgs[0] + '?').setDescription(`1️⃣:${pollArgs[1]}\n2️⃣:${pollArgs[2]}\n3️⃣:${pollArgs[3]}\n4️⃣:${pollArgs[4]}`)
			message.channel.send(embed).then(messageReaction => {
				messageReaction.react('1️⃣');
				messageReaction.react('2️⃣');
				messageReaction.react('3️⃣');
				messageReaction.react('4️⃣');
				message.delete({timeout: 50}).catch(console.error);
			})
		} else {
			message.reply(embed.setTitle('Poll').setDescription('Unknown command. Check your spelling/syntax.'))
		}
	}
}