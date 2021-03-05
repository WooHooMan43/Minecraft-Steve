// Require modules
const ms = require('ms');

module.exports = {
	name: 'ban',
	description: 'Temporarily bans a user from the server.',
	access: [false, true],
	cooldown: 0,
	subcommands: '[@User] [Time] (Reason)',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0]

		if (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			let banTime = ms(args[1]);
			if (typeof banTime != 'number') banTime = parseInt(args[1]); // Use milliseconds if its not already
			let bannedMember = message.mentions.members.first();
			let banReason = args.slice(2,args.length).join(' ');
			if (banReason == '') banReason = 'The ban hammer has spoken'; // If no reason given, use this
			if (!bannedMember.user.bot) { // Don't ban bots
				message.guild.members.ban(bannedMember, { reason: banReason });

				setTimeout(function(){ // Unban user after time
					message.guild.members.unban(bannedMember);
				}, banTime);

				console.log(`Banned ${bannedMember.user.tag} from '${bannedMember.guild.name}' for ${banTime} ms: '${banReason}'.`);
				message.reply(replyEmbed.setColor(0xFF0000).setTitle('Ban').setDescription(`Banned ${bannedMember.user.tag} for ${ms(banTime, { long: true })}: ${banReason}.`));
				return 'Good';
			} else return 'Unknown';
		} else return 'Permission';
	}
}
