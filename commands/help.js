module.exports = {
	name: 'help',
	description: "Displays the help menu.",
	viewable: true,
	admin: false,
	subcommands: '[Command]',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData  = data[0];

		if (args.length == 0) {
			client.commands.forEach(command => {
				if ((command.admin && (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id)) || !command.admin || command.viewable) {
					if (typeof command.subcommands == 'string') replyEmbed.addField(`!${command.name} ${command.subcommands}`, command.description, true);
					else replyEmbed.addField(`!${command.name}`, command.description, true);
				}
			});
			message.reply(replyEmbed.setColor(0x883C88).setTitle('Help'));
			return 'Good';
		} else if (client.commands.some(command => command.name == args[0])) {
			let command = client.commands.get(args[0])
			if ((command.admin && (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id)) || !command.admin) {
				if (typeof command.subcommands == 'object') {
					Object.keys(command.subcommands).forEach(subcommand => {
						replyEmbed.addField(`!${args[0]} ${subcommand}`, command.subcommands[subcommand], true)
					});
					message.reply(replyEmbed.setColor(0x883C88).setTitle('Help'));
					return 'Good';
				} else if (typeof command.subcommands == 'string') {
					message.reply(replyEmbed.setColor(0x883C88).setTitle('Help').addField(`!${args[0]} ${command.subcommands}`, command.description, true ));
					return 'Good';
				} else return 'Unknown';
			} else return 'Permission';
		} else return 'Unknown';
	}
}
