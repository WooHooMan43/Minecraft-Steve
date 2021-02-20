// Require modules
const profileModel = require('../models/profileSchema');

module.exports = {
	name: 'points',
	description: "Gets the member's points on that server.",
	viewable: true,
	admin: true,
	subcommands: {'[@User]': 'Displays the points of a member.', '[@User] [add/remove/set] [value]': 'Modify the points of a member.', '[@User] reset': 'Reset the points of a user.'},
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0];
		let profileData = data[1];

		if (args.length === 0) { // Display a user's points
			message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`You have ${profileData.coins} points.`));
			return 'Good';
		} else {
			if (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
				if (args[0] === 'help') { // Display the help menu
					for (const [key, value] in this.subcommands.entries()) { // Loop through each subcommand
						replyEmbed.addField(`!${this.name} ${key}`, value, true)
					};
					message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription('Help'));
				} else if (message.mentions.members.first()) {
					let memberPoints = message.mentions.members.first()
					try {
						profileData = await profileModel.findOne({ userID: memberPoints.user.id });
						if (!profileData) {
							let profile = await profileModel.create({
								userID: memberPoints.user.id,
								serverID: message.guild.id
							});
							profile.save();
						}
					} catch (err) {
						console.error(err);
					};
					if (!memberPoints.user.bot) {
						if (args.length <= 1) { // Get another user's points
							message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`${memberPoints.user.tag} has ${profileData.coins} points.`));
						} else if (args[1] === 'add') { // Add to a user's points
							const response = await profileModel.findOneAndUpdate({ userID: memberPoints.user.id, serverID: message.guild.id }, { $inc: { coins : parseInt(args[2]) } })
						message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Added ${args[2]} points to ${memberPoints.user.tag}.`).addField('Total', serverpoints[memberPoints.user.id], true));
						} else if (args[1] === 'remove') { // Remove from a user's points
							const response = await profileModel.findOneAndUpdate({ userID: memberPoints.user.id, serverID: message.guild.id }, { $inc: { coins : parseInt(args[2]) * -1 } })
							message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Removed ${args[2]} points from ${memberPoints.user.tag}.`).addField('Total', serverpoints[memberPoints.user.id], true));
						} else if (args[1] === 'reset') { // Set the user's points to 0
							const response = await profileModel.findOneAndUpdate({ userID: memberPoints.user.id, serverID: message.guild.id }, { $set: { coins : 0 } })
							message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Reset ${memberPoints.user.tag} to 0 points.`));
						} else if (args[1] === 'set') { // Change the user's points
							const response = await profileModel.findOneAndUpdate({ userID: memberPoints.user.id, serverID: message.guild.id }, { $set: { coins : parseInt(args[2]) } })
							message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Set ${memberPoints.user.tag} to ${args[2]} points.`));
						};
						return 'Good';
					}
				} else return 'Unknown';
			} else return 'Permission';
		};
	}
}
