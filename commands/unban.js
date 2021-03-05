// Require modules

module.exports = {
	name: 'unban',
	description: 'Unbans a user from the server.',
	access: [false, true],
	cooldown: 0,
	subcommands: '[@User] (Reason)',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0]
		
		if (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			let unbannedMember = message.mentions.members.first();
			let unbanReason = args.slice(1,args.length).join(' ');
			if (unbanReason == '') unbanReason = 'The ban hammer has spoken'; // If no reason given, use this
			if (!unbannedMember.user.bot) { // Don't unban bots
				message.guild.members.unban(unbannedMember, { reason: unbanReason });
				console.log(`Unbanned ${unbannedMember.user.tag} from '${unbannedMember.guild.name}': '${unbanReason}'.`);
				message.reply(replyEmbed.setColor(0xFF0000).setTitle('Unban').setDescription(`Unbanned ${unbannedMember.user.tag}: ${unbanReason}.`));
				return 'Good';
			} else return 'Unknown';
		} else return 'Permission';;
	}
}
