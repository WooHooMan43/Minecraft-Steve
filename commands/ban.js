module.exports = {
	name: 'ban',
	description: 'Bans a user from the server.',
	access: [false, true],
	cooldown: 0,
	subcommands: '[@User] (Reason)',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0];
		if (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			let bannedMember = message.mentions.members.first();
			let banReason = args.slice(1,args.length).join(' ');
			if (banReason == '' || banReason == undefined) banReason = 'The ban hammer has spoken'; // If no reason given, use this
			if (!bannedMember.user.bot) { // Don't ban bots
				message.guild.members.ban(bannedMember, { reason: banReason });
				console.log(`Banned ${bannedMember.user.tag} from '${bannedMember.guild.name}': '${banReason}'.`);
				message.reply(replyEmbed.setColor(0xFF0000).setTitle('Ban').setDescription(`Banned ${bannedMember.user.tag}: ${banReason}.`));
				return 'Good';
			} else return 'Unknown';
		} else return 'Permission';
	}
}
