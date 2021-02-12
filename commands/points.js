// Require modules
const fs = require('fs');

module.exports = {
	name: 'points',
	description: "Gets the member's points on that server.",
	viewable: true,
	admin: true,
	subcommands: {'[@User]': 'Displays the points of a member.', '[@User] [add/remove/set] [value]': 'Modify the points of a member.', '[@User] reset': 'Reset the points of a user.'},
	async execute(client, message, args, Discord, replyEmbed){
		if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[]};
		};
		if (fs.existsSync(`guilds/${message.guild.id}/points.json`)) {
			let serverpoints_raw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
			var serverpoints = JSON.parse(serverpoints_raw);
		} else {
			var serverpoints = {};
		};

		if (args.length === 0) { // Display a user's points
			message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`You have ${(message.member.id in serverpoints) ? serverpoints[message.member.id] : 0} points.`));
			return 'Good';
		} else {
			if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
				if (args[0] === 'help') { // Display the help menu
					for (const [key, value] in this.subcommands.entries()) { // Loop through each subcommand
						replyEmbed.addField(`!${this.name} ${key}`, value, true)
					};
					message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription('Help'));
					} else if (message.mentions.members.first()) {
					let memberPoints = message.mentions.members.first()
					if (!memberPoints.user.bot) {
						if (args.length <= 1) { // Get another user's points
							message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`${memberPoints.user.tag} has ${serverpoints[memberPoints.user.id]} points.`));
						} else if (args[1] === 'add') { // Add to a user's points
							serverpoints[memberPoints.user.id] += parseInt(args[2]);
							message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Added ${args[2]} points to ${memberPoints.user.tag}.`).addField('Total', serverpoints[memberPoints.user.id], true));
						} else if (args[1] === 'remove') { // Remove from a user's points
							serverpoints[memberPoints.user.id] -= parseInt(args[2]);
							message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Removed ${args[2]} points from ${memberPoints.user.tag}.`).addField('Total', serverpoints[memberPoints.user.id], true));
						} else if (args[1] === 'reset') { // Set the user's points to 0
							serverpoints[memberPoints.user.id] = 0;
							message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Reset ${memberPoints.user.tag} to 0 points.`));
						} else if (args[1] === 'set') { // Change the user's points
							serverpoints[memberPoints.user.id] = parseInt(args[2]);
							message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Set ${memberPoints.user.tag} to ${args[2]} points.`));
						};
						
						// Save the points
						let serverpoints_new = JSON.stringify(serverpoints);
						fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpoints_new, function(err, result) {
							if(err) console.log('error', err);
							console.log(`Saved points of ${message.guild.name}.`)
						});
						return 'Good';
					}
				} else return 'Unknown';
			} else return 'Permission';
		};
	}
}
