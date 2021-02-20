// Require modules
const settingsModel = require('../models/settingsSchema');

const ms = require('ms');

module.exports = {
	name: 'tempmute',
	description: "Temporarily mutes a user on the server.",
	viewable: false,
	admin: true,
	subcommands: '[@User] [Time] (Reason)',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0]

		if (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			if (ms(args[1]) != undefined) { // Check for valid time
				let mutedMember = message.mentions.members.first();
				let muteReason = args.slice(2,args.length).join(' ');
				if (muteReason == '') muteReason = 'Muted by moderator'; // If no reason given, use this
				if (!mutedMember.user.bot) { // Don't mute bots
					const responseMute = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $push: { MutedMembers: mutedMember.id } });

					setTimeout(async function(){ // Unmute the user after time
						const responseUnmute = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $pull: { MutedMembers: { $in : mutedMember.id } } })
					}, ms(args[1]));

					console.log(`Muted ${mutedMember.user.tag} in '${mutedMember.guild.name}' for ${ms(args[1])} ms: '${muteReason}'.`);
					message.reply(replyEmbed.setColor(0xFF0000).setTitle('Mute').setDescription(`Muted ${mutedMember.user.tag} for ${ms(ms(args[1]))}: ${muteReason}.`));
					return 'Good';
				}
			} else return 'Unknown';
		} else return 'Permission';
	}
}
