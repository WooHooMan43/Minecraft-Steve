// Require modules
const settingsModel = require('../models/settingsSchema');

module.exports = {
	name: 'mute',
	description: 'Mutes a user on the server.',
	access: [false, true],
	cooldown: 0,
	subcommands: '[@User] (Reason)',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0];

		if (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			let mutedMember = message.mentions.members.first();
			let muteReason = args.slice(1,args.length).join(' ');
			if (muteReason == '') muteReason = 'Muted by moderator'; // If no reason given, use this
			if (!mutedMember.user.bot) { // Don't mute bots
				const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $push: { MutedMembers: mutedMember.id } });
				console.log(`Muted ${mutedMember.user.tag} in '${mutedMember.guild.name}': '${muteReason}'.`);
				message.reply(replyEmbed.setColor(0xFF0000).setTitle('Mute').setDescription(`Muted ${mutedMember.user.tag}: ${muteReason}.`));
				return 'Good';
			} else return 'Unknown';
		} else return 'Permission';;
	}
}
