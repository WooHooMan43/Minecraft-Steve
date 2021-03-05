// Require modules
const settingsModel = require('../models/settingsSchema');

const ms = require('ms');

module.exports = {
	name: 'tempmute',
	description: 'Temporarily mutes a user on the server.',
	access: [false, true],
	cooldown: 0,
	subcommands: '[@User] [Time] (Reason)',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0]

		if (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			let muteTime = ms(args[1]);
			if (typeof muteTime != 'number') muteTime = parseInt(args[1]); // Use milliseconds if its not already
			let mutedMember = message.mentions.members.first();
			let muteReason = args.slice(2,args.length).join(' ');
			if (muteReason == '') muteReason = 'Muted by moderator'; // If no reason given, use this
			if (!mutedMember.user.bot) { // Don't mute bots
				const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $push: { MutedMembers: mutedMember.id } });

				setTimeout(async function(){ // Unmute the user after time
					await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $pull: { MutedMembers: { $in : mutedMember.id } } });
				}, muteTime);

				console.log(`Muted ${mutedMember.user.tag} in '${mutedMember.guild.name}' for ${muteTime} ms: '${muteReason}'.`);
				message.reply(replyEmbed.setColor(0xFF0000).setTitle('Mute').setDescription(`Muted ${mutedMember.user.tag} for ${ms(muteTime, { long: true })}: ${muteReason}.`));
				return 'Good';
			} else return 'Unknown';
		} else return 'Permission';
	}
}
