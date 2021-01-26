const Discord = require('discord.js');

const fs = require('fs');

function usePoints(message, args, serverpoints) {
	var foundUser = false;
	message.guild.members.cache.forEach(user => {
		if (args[0] != undefined && user.user.id === args[0].replace(/[<@!>]/g, '')  && !user.user.bot) {
			if (args[1] === 'add') {
				serverpoints[user.user.id] += parseInt(args[2]);
				const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Added ${args[1]} points to ${user.user.tag}.`).addField('Total', serverpoints[user.user.id], true);
				message.reply(embed);
				foundUser = true;
			} else if (args[1] === 'remove') {
				serverpoints[user.user.id] -= parseInt(args[2]);
				const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Removed ${args[1]} points from ${user.user.tag}.`).addField('Total', serverpoints[user.user.id], true);
				message.reply(embed);
				foundUser = true;
			} else if (args[1] === 'reset') {
				serverpoints[user.user.id] = 0;
				const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Reset ${user.user.tag} to 0 points.`);
				message.reply(embed);
				foundUser = true;
			} else if (args[1] === 'set') {
				serverpoints[user.user.id] = parseInt(args[2]);
				const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Reset ${user.user.tag} to 0 points.`);
				message.reply(embed);
				foundUser = true;
			};
			if (!foundUser) {
				const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription('Unknown user/command: check your spelling/syntax.');
				message.reply(embed)
			};
		} else if (args[0] === 'help') {
			const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription('Help').addFields({name: '!points [@User]', value: 'Displays the points of a member.', inline: true},{name: '!points [@User] [add/remove/set] [value]', value: 'Modify the points of a user', inline: true},{name: '!points [@User] reset', value: 'Reset the points of a user.', inline: true});
			message.reply(embed);
		}
	});
	return serverpoints
}

module.exports = {
	name: 'points',
	description: "this is a points management command!",
	execute(message, args){
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
		for (var key in serverpoints) {
			var points = serverpoints[key];
			var pointsUsed = false;
			if (message.author.id == key) {
				if (args.length == 0) {
					const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`You have ${(message.author.id in serverpoints) ? points : 0} points.`);
					message.reply(embed);
				} else {
					message.guild.roles.cache.forEach(role => {
						if (!pointsUsed && message.member.roles.cache.has(role.id) && properties.AdminRoles.includes(role.name)) {
							serverpoints = usePoints(message, args, serverpoints)
							pointsUsed = true		
						}
					});
					message.guild.members.cache.forEach(member => {
						if (!pointsUsed && properties.UserExceptions.includes(member.user.id)) {
							serverpoints = usePoints(message, args, serverpoints)
							pointsUsed = true
						}
					});
					if (!pointsUsed) {
						const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription('You do not have permission to use this command.');
						message.reply(embed)
					}
				}
			}
		}
		let serverpointsStr = JSON.stringify(serverpoints);
		fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpointsStr, function(err, result) {
			if(err) console.log('error', err);
			console.log(`Saved points of ${message.guild.name}.`)
		})
	}
}
