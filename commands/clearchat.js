module.exports = {
	name: 'clearchat',
	description: "Deletes a certain number preceding messages.",
	viewable: false,
	admin: true,
	subcommands: '[Value]',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0]
		// Check permissions and delete messages
		if (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			if (!isNaN(args[0]) && parseInt(args[0]) >= 0) { // Check for number then delete
				message.channel.messages.fetch({ limit: parseInt(args[0]) }).then(messages => {
					message.channel.bulkDelete(messages)
				});
				message.reply(replyEmbed.setColor(0x003CFF).setTitle('Clear Chat').setDescription(`Cleared ${args[0]} messages.`));
				return 'Good';
			} else return 'Unknown';
		} else return 'Permission';;
	}
}
