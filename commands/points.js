const fs = require('fs');

module.exports = {
	name: 'points',
	description: "View your points.",
	async execute(client, message, args, Discord){
		if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
		};
		if (fs.existsSync(`guilds/${message.guild.id}/points.json`)) {
			let serverpoints_raw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
			var serverpoints = JSON.parse(serverpoints_raw);
		} else {
			var serverpoints = {};
		};

		if (args.length === 0) {
			const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`You have ${(message.member.id in serverpoints) ? serverpoints[message.member.id] : 0} points.`);
			message.reply(embed);
		} else {
			if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
				const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points');
				if (args[0] === 'help') {
					message.reply(embed.setDescription('Help').addFields({name: '!points [@User]', value: 'Displays the points of a member.', inline: true},{name: '!points [@User] [add/remove/set] [value]', value: 'Modify the points of a user', inline: true},{name: '!points [@User] reset', value: 'Reset the points of a user.', inline: true}));
				} else if (message.mentions.members.first()) {
					let memberPoints = message.mentions.members.first()
					if (!memberPoints.user.bot) {
						if (args.length <= 1) {
							message.reply(embed.setDescription(`${memberPoints.user.tag} has ${serverpoints[memberPoints.user.id]} points.`));
						} else if (args[1] === 'add') {
							serverpoints[memberPoints.user.id] += parseInt(args[2]);
							message.reply(embed.setDescription(`Added ${args[2]} points to ${memberPoints.user.tag}.`).addField('Total', serverpoints[memberPoints.user.id], true));
						} else if (args[1] === 'remove') {
							serverpoints[memberPoints.user.id] -= parseInt(args[2]);
							message.reply(embed.setDescription(`Removed ${args[2]} points from ${memberPoints.user.tag}.`).addField('Total', serverpoints[memberPoints.user.id], true));
						} else if (args[1] === 'reset') {
							serverpoints[memberPoints.user.id] = 0;
							message.reply(embed.setDescription(`Reset ${memberPoints.user.tag} to 0 points.`));
						} else if (args[1] === 'set') {
							serverpoints[memberPoints.user.id] = parseInt(args[2]);
							message.reply(embed.setDescription(`Set ${memberPoints.user.tag} to ${args[2]} points.`));
						};
						
						let serverpoints_new = JSON.stringify(serverpoints);
						fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpoints_new, function(err, result) {
							if(err) console.log('error', err);
							console.log(`Saved points of ${message.guild.name}.`)
						})
					}
				} else {
					message.reply(embed.setDescription(`'${message}' is an unknown command. Check your spelling/syntax.`));
				}
			} else {
				const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription('You do not have permission to use this command.');
				message.reply(embed);
			}
		};
	}
}
