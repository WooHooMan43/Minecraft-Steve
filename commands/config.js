const Discord = require('discord.js');

const fs = require("fs");

module.exports = {
	name: 'config',
	description: "this is a configuration command!",
	execute(message, args){
		let propertiesraw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
		var properties = JSON.parse(propertiesraw);
		var configUsed = false
		message.guild.roles.cache.forEach(role => {
			if (!configUsed) {
				if (message.member.roles.cache.has(role.id) && properties.AdminRoles.includes(role.name)) {
					if (args[0] === "help") {
						const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription('Help').addFields({name: '!config help', value: 'Displays the config help menu.', inline: true},{name: '!config adminroles <add/delete/list> <name>', value: 'Change which roles have permission to edit the config.', inline: true},{name: '!config userexceptions <add/delete/list> <@user>', value: 'Change which users have permission to edit the config.', inline: true},{name: '!config server <address>', value: 'Changes the server which !status acquires data from.', inline: true});
						message.reply(embed);
						message.delete({timeout: 50}).catch(console.error);
					} else if (args[0] === "server") {
						properties.ServerAddress = args[1];
						const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Server set to '${args[1]}'.`);
						message.reply(embed);
						message.delete({timeout: 50}).catch(console.error);
					} else if (args[0] === "adminroles") {
						if (args[1] === "add") {
							properties.AdminRoles.push(args[2]);
							const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Added '${args[2]}' to administrative roles.`);
							message.reply(embed);
							message.delete({timeout: 50}).catch(console.error);
						} else if (args[1] === "delete") {
							if (args[2] in properties.AdminRoles) {
								properties.AdminRoles.pop(args[2]);
								const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Removed '${args[2]}' from administrative roles.`);
								message.reply(embed);
								message.delete({timeout: 50}).catch(console.error);
							} else {
								const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Role '${args[2]}' is not an administrative role.`);
								message.reply(embed);
								message.delete({timeout: 50}).catch(console.error);
							}
						} else if (args[1] === "list") {
							if (properties.AdminRoles.length > 0) {
								var AdminRolesStr = "The role(s) with permissions to edit the config is/are";
								for (r = 0; r < properties.AdminRoles.length; r++) {
									if (r < properties.AdminRoles.length - 1) {
										AdminRolesStr += " " + properties.AdminRoles[r] + ",";
									} else {
										AdminRolesStr += " and " + properties.AdminRoles[r] + ".";
									}
								}
							} else {
								var AdminRolesStr = "There are no roles with permissions to edit the config."
							}
							const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(AdminRolesStr);
							message.reply(embed);
							message.delete({timeout: 50}).catch(console.error);
						} else {
							const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription("Unknown command. Check your spelling/syntax.");
							message.reply(embed);
							message.delete({timeout: 50}).catch(console.error);
						}
					} else if (args[0] === "userexceptions") {
						if (args[1] === "add") {
							message.guild.members.cache.forEach(user => {
								if (user.user.id === args[2].substring(2,args[2].length-1) && !user.user.bot) {
									properties.UserExceptions.push(user.user.id);
									const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Added user '${user.user.tag}' as an exception.`);
									message.reply(embed);
									message.delete({timeout: 50}).catch(console.error);
								}
							});
						} else if (args[1] === "delete") {
							var UserExceptionsOldLen = properties.UserExceptions.length
							message.guild.members.cache.forEach(user => {
								if (user.user.id === args[2].substring(2,args[2].length-1) && !user.user.bot) {
									if (properties.UserExceptions.includes(user.user.id)) {
										properties.UserExceptions.pop(user.user.id);
										const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Removed user '${user.user.tag}' as an exception.`);
										message.reply(embed);
										message.delete({timeout: 50}).catch(console.error);
									}
								}
							});
							if (UserExceptionsOldLen === properties.UserExceptions.length) {
								const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`User '${args[2]}' is not an exception.`);
								message.reply(embed);
								message.delete({timeout: 50}).catch(console.error);
							}
						} else if (args[1] === "list") {
							if (properties.UserExceptions.length > 0) {
								var UserExceptionsStr = "The user(s) with permissions to edit the config is/are";
								message.guild.members.cache.forEach(member => {
									if (properties.UserExceptions.includes(member.user.id)) {
										if (properties.UserExceptions[properties.UserExceptions.length - 1] != member.user.id && properties.UserExceptions.length > 1) {
											UserExceptionsStr += " " + member.user.tag + ",";
										} else if (properties.UserExceptions[properties.UserExceptions.length - 1] == member.user.id && properties.UserExceptions.length > 1) {
											UserExceptionsStr += " and " + member.user.tag + ".";
										} else {
											UserExceptionsStr += " " + member.user.tag + ".";
										}
									}
								})
							} else {
							var UserExceptionsStr = "There are no users with permissions to edit the config.";
							}
						const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(UserExceptionsStr);
						message.reply(embed);
						message.delete({timeout: 50}).catch(console.error);
						}
					} else {
						const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription("Unknown command. Check your spelling/syntax. arg ");
						message.reply(embed);
						message.delete({timeout: 50}).catch(console.error);
					};
					configUsed = true
				}
			}
		});
		message.guild.members.cache.forEach(member => {
			if (!configUsed) {
				if (properties.UserExceptions.includes(member.user.id)) {
					if (args[0] === "help") {
						const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription('Help').addFields({name: '!config help', value: 'Displays the config help menu.', inline: true},{name: '!config adminroles <add/delete/list> <name>', value: 'Change which roles have permission to edit the config.', inline: true},{name: '!config userexceptions <add/delete/list> <@user>', value: 'Change which users have permission to edit the config.', inline: true},{name: '!config server <address>', value: 'Changes the server which !status acquires data from.', inline: true});
						message.reply(embed);
						message.delete({timeout: 50}).catch(console.error);
					} else if (args[0] === "server") {
						properties.ServerAddress = args[1];
						const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Server set to '${args[1]}'.`);
						message.reply(embed);
						message.delete({timeout: 50}).catch(console.error);
					} else if (args[0] === "adminroles") {
						if (args[1] === "add") {
							properties.AdminRoles.push(args[2]);
							const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Added '${args[2]}' to administrative roles.`);
							message.reply(embed);
							message.delete({timeout: 50}).catch(console.error);
						} else if (args[1] === "delete") {
							if (args[2] in properties.AdminRoles) {
								properties.AdminRoles.pop(args[2]);
								const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Removed '${args[2]}' from administrative roles.`);
								message.reply(embed);
								message.delete({timeout: 50}).catch(console.error);
							} else {
								const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Role '${args[2]}' is not an administrative role.`);
								message.reply(embed);
								message.delete({timeout: 50}).catch(console.error);
							}
						} else if (args[1] === "list") {
							if (properties.AdminRoles.length > 0) {
								var AdminRolesStr = "The role(s) with permissions to edit the config is/are";
								for (r = 0; r < properties.AdminRoles.length; r++) {
									if (r < properties.AdminRoles.length - 1) {
										AdminRolesStr += " " + properties.AdminRoles[r] + ",";
									} else {
										AdminRolesStr += " and " + properties.AdminRoles[r] + ".";
									}
								}
							} else {
								var AdminRolesStr = "There are no roles with permissions to edit the config."
							}
							const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(AdminRolesStr);
							message.reply(embed);
							message.delete({timeout: 50}).catch(console.error);
						} else {
							const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription("Unknown command. Check your spelling/syntax.");
							message.reply(embed);
							message.delete({timeout: 50}).catch(console.error);
						}
					} else if (args[0] === "userexceptions") {
						if (args[1] === "add") {
							message.guild.members.cache.forEach(user => {
								if (user.user.id === args[2].substring(2,args[2].length-1) && !user.user.bot) {
									properties.UserExceptions.push(user.user.id);
									const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Added user '${user.user.tag}' as an exception.`);
									message.reply(embed);
									message.delete({timeout: 50}).catch(console.error);
								}
							});
						} else if (args[1] === "delete") {
							var UserExceptionsOldLen = properties.UserExceptions.length
							message.guild.members.cache.forEach(user => {
								if (user.user.id === args[2].substring(2,args[2].length-1) && !user.user.bot) {
									if (properties.UserExceptions.includes(user.user.id)) {
										properties.UserExceptions.pop(user.user.id);
										const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`Removed user '${user.user.tag}' as an exception.`);
										message.reply(embed);
										message.delete({timeout: 50}).catch(console.error);
									}
								}
							});
							if (UserExceptionsOldLen === properties.UserExceptions.length) {
								const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(`User '${args[2]}' is not an exception.`);
								message.reply(embed);
								message.delete({timeout: 50}).catch(console.error);
							}
						} else if (args[1] === "list") {
							if (properties.UserExceptions.length > 0) {
								var UserExceptionsStr = "The user(s) with permissions to edit the config is/are";
								message.guild.members.cache.forEach(member => {
									if (properties.UserExceptions.includes(member.user.id)) {
										if (properties.UserExceptions[properties.UserExceptions.length - 1] != member.user.id && properties.UserExceptions.length > 1) {
											UserExceptionsStr += " " + member.user.tag + ",";
										} else if (properties.UserExceptions[properties.UserExceptions.length - 1] == member.user.id && properties.UserExceptions.length > 1) {
											UserExceptionsStr += " and " + member.user.tag + ".";
										} else {
											UserExceptionsStr += " " + member.user.tag + ".";
										}
									}
								})
							} else {
							var UserExceptionsStr = "There are no users with permissions to edit the config.";
							}
						const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription(UserExceptionsStr);
						message.reply(embed);
						message.delete({timeout: 50}).catch(console.error);
						}
					} else {
						const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription("Unknown command. Check your spelling/syntax. arg ");
						message.reply(embed);
						message.delete({timeout: 50}).catch(console.error);
					};
					configUsed = true
				}
			}
		});
		if (!configUsed) {
			const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription("You do not have permission to use this command.");
			message.reply(embed);
			message.delete({timeout: 50}).catch(console.error);
		};
		let saveSettings = {
			"ServerAddress" : properties.ServerAddress,
			"AdminRoles" : properties.AdminRoles,
			"UserExceptions" : properties.UserExceptions
		};
		let SettingsStr = JSON.stringify(saveSettings);
		fs.writeFile(`./guilds/${message.guild.id}/configuration.json`, SettingsStr, function(err, result) {
			if(err) console.log('error', err);
		});
	}
}
