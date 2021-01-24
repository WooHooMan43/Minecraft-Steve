const Discord = require('discord.js');

const fs = require('fs');

module.exports = {
	name: 'points',
	description: "this is a points management command!",
	execute(message, args){
		let propertiesraw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
		var properties = JSON.parse(propertiesraw);
		let serverpointsraw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
		var serverpoints = JSON.parse(serverpointsraw);
		for (var key in serverpoints) {
			var points = serverpoints[key];
			var pointsUsed = false;
			if (message.author.id == key) {
				if (args.length == 0) {
					const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`You have ${(message.author.id in serverpoints) ? points : 0} points.`);
					message.reply(embed);
				} else if (args[0] === 'help') {
					const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription('Help').addFields({name: '!points help', value: 'Displays the points help menu.', inline: true},{name: '!points', value: 'Displays your points', inline: true},{name: '!points user <@user>', value: 'Displays the points of a member.', inline: true},{name: '!points add <points> <@user>', value: 'Adds points to a user', inline: true},{name: '!points remove <points> <@user>', value: 'Removes points from a user.', inline: true},{name: '!points reset <@user>', value: 'Resets the points of a user.', inline: true});
					message.reply(embed);
				} else {
					message.guild.roles.cache.forEach(role => {
						if (!pointsUsed) {
							if (message.member.roles.cache.has(role.id) && properties.AdminRoles.includes(role.name)) {
								var foundUser = false;
								if (args[0] === 'add') {
									message.guild.members.cache.forEach(user => {
										if (user.user.id === args[2].substring(2,args[2].length-1) && !user.user.bot) {
											serverpoints[user.user.id] += parseInt(args[1]);
											const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Added ${args[1]} points to ${user.user.tag}.`).addField('Total', serverpoints[user.user.id], true);
											message.reply(embed);
											foundUser = true;
										}
									});
									if (args.length <= 2) {
										serverpoints[message.author.id] += parseInt(args[1]);
										const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Added ${args[1]} to your points.`).addField('Total', serverpoints[message.author.id], true);
										message.reply(embed);
									}
								} else if (args[0] === 'remove') {
									message.guild.members.cache.forEach(user => {
										if (user.user.id === args[2].substring(2,args[2].length-1) && !user.user.bot) {
											serverpoints[user.user.id] -= parseInt(args[1]);
											const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Removed ${args[1]} points from ${user.user.tag}.`).addField('Total', serverpoints[user.user.id], true);
											message.reply(embed);
											foundUser = true;
										}
									});
									if (args.length <= 2) {
										serverpoints[message.author.id] -= parseInt(args[1]);
										const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Removed ${args[1]} from your points.`).addField('Total', serverpoints[message.author.id], true);
										message.reply(embed);
									}
								} else if (args[0] === 'reset') {
									message.guild.members.cache.forEach(user => {
										if (user.user.id === args[1].substring(2,args[1].length-1) && !user.user.bot) {
											serverpoints[user.user.id] = 0;
											const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Reset ${user.user.tag} to 0 points.`);
											message.reply(embed);
											foundUser = true;
										}
									});
									if (args.length == 1) {
										serverpoints[message.author.id] = 0;
										const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Reset your points.`);
										message.reply(embed);
								}
								} else if (args[0] === 'user') {
									message.guild.members.cache.forEach(user => {
										if (args[1] != undefined && user.user.id === args[1].replace(/[<@!>]/g, '')  && !user.user.bot) {
											const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`${user.user.tag} has ${(user.user.id in serverpoints) ? serverpoints[user.user.id] : 0} points.`);
											message.reply(embed);
											foundUser = true;
										}
									})
								};
								if (!foundUser) {
									const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription('Unknown user/command: check your spelling/syntax.');
									message.reply(embed)
								};
								pointsUsed = true
							}
						}
					});
					message.guild.members.cache.forEach(member => {
						if (!pointsUsed) {
							if (properties.UserExceptions.includes(member.user.id)) {
								var foundUser = false;
								if (args[0] === 'add') {
									message.guild.members.cache.forEach(user => {
										if (user.user.id === args[2].substring(2,args[2].length-1) && !user.user.bot) {
											serverpoints[user.user.id] += parseInt(args[1]);
											const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Added ${args[1]} points to ${user.user.tag}.`).addField('Total', serverpoints[user.user.id], true);
											message.reply(embed);
											foundUser = true;
										}
									});
									if (args.length <= 2) {
										serverpoints[message.author.id] += parseInt(args[1]);
										const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Added ${args[1]} to your points.`).addField('Total', serverpoints[message.author.id], true);
										message.reply(embed);
									}
								} else if (args[0] === 'remove') {
									message.guild.members.cache.forEach(user => {
										if (user.user.id === args[2].substring(2,args[2].length-1) && !user.user.bot) {
											serverpoints[user.user.id] -= parseInt(args[1]);
											const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Removed ${args[1]} points from ${user.user.tag}.`).addField('Total', serverpoints[user.user.id], true);
											message.reply(embed);
											foundUser = true;
										}
									});
									if (args.length <= 2) {
										serverpoints[message.author.id] -= parseInt(args[1]);
										const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Removed ${args[1]} from your points.`).addField('Total', serverpoints[message.author.id], true);
										message.reply(embed);
									}
								} else if (args[0] === 'reset') {
									message.guild.members.cache.forEach(user => {
										if (user.user.id === args[1].substring(2,args[1].length-1) && !user.user.bot) {
											serverpoints[user.user.id] = 0;
											const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Reset ${user.user.tag} to 0 points.`);
											message.reply(embed);
											foundUser = true;
										}
									});
									if (args.length == 1) {
										serverpoints[message.author.id] = 0;
										const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Reset your points.`);
										message.reply(embed);
								}
								} else if (args[0] === 'user') {
									message.guild.members.cache.forEach(user => {
										if (user.user.id === args[1].substring(2,args[1].length-1) && !user.user.bot) {
											const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`${user.user.tag} has ${(user.user.id in serverpoints) ? serverpoints[user.user.id] : 0} points.`);
											message.reply(embed);
											foundUser = true;
										}
									})
								};
								if (!foundUser) {
									const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription('Unknown user/command: check your spelling/syntax.');
									message.reply(embed)
								};
								pointsUsed = true
							}
						}
					});
					if (!pointsUsed) {
						const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription('You do not have permission to use this command.');
						message.reply(embed)
					}
				}
			};
			let serverpointsStr = JSON.stringify(serverpoints);
			fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpointsStr, function(err, result) {
				if(err) console.log('error', err);
			})
		}
	}
}
