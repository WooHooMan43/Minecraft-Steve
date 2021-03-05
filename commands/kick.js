module.exports = {
	name: 'kick',
	description: 'Removes a user from the server.',
	access: [false, true],
	cooldown: 0,
	subcommands: '[@User] (Reason)',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0];
		// Check permissions and kick the user
		if (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			let kickedMember = message.mentions.members.first();
			let kickReason = args.slice(1,args.length).join(' ');
			if (kickReason == '') kickReason = 'Kicked by moderator'; // If no reason given, use this
			if (!kickedMember.user.bot) { // Don't kick bots
				kickedMember.kick(kickReason);
				console.log(`Kicked ${kickedMember.user.tag} from '${kickedMember.guild.name}': '${kickReason}'.`);
				message.reply(replyEmbed.setColor(0xFF0000).setTitle('Kick').setDescription(`Kicked ${kickedMember.user.tag}: ${kickReason}.`));
				return 'Good';
			} else return 'Unknown';
		} else return 'Permission';
	}
}
