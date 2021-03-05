// Require modules
const settingsModel = require('../models/settingsSchema');

module.exports = {
	name: 'unmute',
	description: 'Unmutes a user on the server.',
	access: [false, true],
	cooldown: 0,
	subcommands: '[@User] (Reason)',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0]

		if (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			let unmutedMember = message.mentions.members.first();
			let unmuteReason = args.slice(1,args.length).join(' ');
			if (unmuteReason == '' || unmuteReason == undefined) unmuteReason = 'Unmuted by moderator'; // If no reason given, use this
			if (!unmutedMember.user.bot) { // Don't unmute bots
				const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $pull: { MutedMembers: { $in: unmutedMember.id } } });
				console.log(`Unmuted ${unmutedMember.user.tag} in '${unmutedMember.guild.name}': '${unmuteReason}'.`);
				message.reply(replyEmbed.setColor(0xFF0000).setTitle('Unmute').setDescription(`Unmuted ${unmutedMember.user.tag}: ${unmuteReason}.`));
				return 'Good';
			} else return 'Unknown';
		} else return 'Permission';;
	}
}
