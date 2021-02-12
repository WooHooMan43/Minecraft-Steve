module.exports = {
	name: 'poll',
	description: "Creates a poll for members to vote on.",
	viewable: true,
	admin: false,
	subcommands: {'YN [Title]': 'Create a poll to vote to do something.', '2 [Title]; [Option 1]; [Option 2]': 'Create a poll to choose between 2 options.', '3 [Title]; [Option 1]; [Option 2]; [Option 3]': 'Create a poll to choose between 3 options.', '4 [Title]; [Option 1]; [Option 2]; [Option 3]; [Option 4]': 'Create a poll to choose between 4 options.'},
	async execute(client, message, args, Discord, replyEmbed){
		var pollArgs = args.slice(1).join(' ').split(';');
		
		if (args[0] === 'YN'){ // Make a yes or no poll
			message.channel.send(replyEmbed.setColor(0xFFC300).setTitle(pollArgs[0]).setDescription('Vote 👍 or 👎')).then(messageReaction => {
				messageReaction.react('👍');
				messageReaction.react('👎');
				message.delete({timeout: 50}).catch(console.error);
			});
			return 'Good';
		} else if (args[0] === '2') { // Create a 2 option poll
			message.channel.send(replyEmbed.setColor(0xFFC300).setTitle(pollArgs[0]).setDescription(`1️⃣:${pollArgs[1]}\n2️⃣:${pollArgs[2]}`)).then(messageReaction => {
				messageReaction.react('1️⃣');
				messageReaction.react('2️⃣');
				message.delete({timeout: 50}).catch(console.error);
			});
			return 'Good';
		} else if (args[0] === '3') { // Create a 3 option poll
			message.channel.send(replyEmbed.setColor(0xFFC300).setTitle(pollArgs[0]).setDescription(`1️⃣:${pollArgs[1]}\n2️⃣:${pollArgs[2]}\n3️⃣:${pollArgs[3]}`)).then(messageReaction => {
				messageReaction.react('1️⃣');
				messageReaction.react('2️⃣');
				messageReaction.react('3️⃣');
				message.delete({timeout: 50}).catch(console.error);
			});
			return 'Good';
		} else if (args[0] === '4') { // Create a 4 option poll
			message.channel.send(replyEmbed.setColor(0xFFC300).setTitle(pollArgs[0]).setDescription(`1️⃣:${pollArgs[1]}\n2️⃣:${pollArgs[2]}\n3️⃣:${pollArgs[3]}\n4️⃣:${pollArgs[4]}`)).then(messageReaction => {
				messageReaction.react('1️⃣');
				messageReaction.react('2️⃣');
				messageReaction.react('3️⃣');
				messageReaction.react('4️⃣');
				message.delete({timeout: 50}).catch(console.error);
			});
			return 'Good';
		} else return 'Unknown';
	}
}