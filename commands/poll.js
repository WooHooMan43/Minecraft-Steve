const Discord = require('discord.js');

module.exports = {
	name: 'poll',
	description: "this is a poll command!",
	execute(message, args){
		const Embed = new Discord.MessageEmbed();

		var pollArgs = args.slice(1).join(' ').split('.');
		
		if (args[0] === 'YN'){
			Embed.setColor(0xFFC300).setTitle(pollArgs[0] + '?').setDescription('Vote 👍 or 👎')
			message.channel.send(Embed).then(messageReaction => {
				messageReaction.react('👍');
				messageReaction.react('👎');
				message.delete({timeout: 50}).catch(console.error);
			})
		} else if (args[0] === '2') {
			Embed.setColor(0xFFC300).setTitle(pollArgs[0] + '?').setDescription(`1️⃣:${pollArgs[1]}\n2️⃣:${pollArgs[2]}`)
			message.channel.send(Embed).then(messageReaction => {
				messageReaction.react('1️⃣');
				messageReaction.react('2️⃣');
				message.delete({timeout: 50}).catch(console.error);
			})
		} else if (args[0] === '3') {
			Embed.setColor(0xFFC300).setTitle(pollArgs[0] + '?').setDescription(`1️⃣:${pollArgs[1]}\n2️⃣:${pollArgs[2]}\n3️⃣:${pollArgs[3]}`)
			message.channel.send(Embed).then(messageReaction => {
				messageReaction.react('1️⃣');
				messageReaction.react('2️⃣');
				messageReaction.react('3️⃣');
				message.delete({timeout: 50}).catch(console.error);
			})
		} else if (args[0] === '4') {
			Embed.setColor(0xFFC300).setTitle(pollArgs[0] + '?').setDescription(`1️⃣:${pollArgs[1]}\n2️⃣:${pollArgs[2]}\n3️⃣:${pollArgs[3]}\n4️⃣:${pollArgs[4]}`)
			message.channel.send(Embed).then(messageReaction => {
				messageReaction.react('1️⃣');
				messageReaction.react('2️⃣');
				messageReaction.react('3️⃣');
				messageReaction.react('4️⃣');
				message.delete({timeout: 50}).catch(console.error);
			})
		} else {
			message.reply('Unknown command: check your spelling/syntax.')
		}
	}
}