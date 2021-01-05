const Discord = require('discord.js');

const fs = require("fs");

function useConfig(message, args) {
	const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config')
	if (args[0] === "help") {
		message.reply(embed.setDescription('Help').addFields({name: '!config help', value: 'Displays the config help menu.', inline: true},{name: '!config adminroles <add/delete/list> <name>', value: 'Change which roles have permission to edit the config.', inline: true},{name: '!config userexceptions <add/delete/list> <@user>', value: 'Change which users have permission to edit the config.', inline: true},{name: '!config server <address>', value: 'Changes the server which !status acquires data from.', inline: true},{name: '!config bannedwords <add/delete> <word>', value: 'Change which words are banned from the server.', inline: true},{name: '!config reset', value: 'Reset the configs.', inline: true}));
	} else if (args[0] === "server") {
		properties.ServerAddress = args[1];
		message.reply(embed.setDescription(`Server set to '${args[1]}'.`));
	} else if (args[0] === "adminroles") {
		if (args[1] === "add") {
			if (args[2] in properties.AdminRoles) {
				message.reply(embed.setDescription(`Role '${args[2]}' is already an administrative role.`));
			} else {
				properties.AdminRoles.push(args[2]);	
				message.reply(embed.setDescription(`Added role '${args[2]}' to administrative roles.`));
			}
		} else if (args[1] === "delete") {
			if (args[2] in properties.AdminRoles) {
				properties.AdminRoles.splice(properties.AdminRoles.indexOf(args[2]),1);
				message.reply(embed.setDescription(`Removed role '${args[2]}' from administrative roles.`));
			} else {
				message.reply(embed.setDescription(`Role '${args[2]}' is not an administrative role.`));
			}
		} else if (args[1] === "list") {
			if (properties.AdminRoles.length > 0) {
				var AdminRolesStr = "The role(s) with permissions to edit the config is/are";
				for (role_index = 0; role_index < properties.AdminRoles.length; role_index++) {
					if (role_index < properties.AdminRoles.length - 1) {
						AdminRolesStr += " '" + properties.AdminRoles[role_index] + "',";
					} else {
						AdminRolesStr += " and '" + properties.AdminRoles[role_index] + "'.";
					}
				}
			} else {
				var AdminRolesStr = "There are no roles with permissions to edit the config."
			}
			message.reply(embed.setDescription(AdminRolesStr));
		} else {
			message.reply(embed.setDescription("Unknown command. Check your spelling/syntax."));
		}
	} else if (args[0] === "userexceptions") {
		if (args[1] === "add") {
			message.guild.members.cache.forEach(user => {
				if (user.user.id === args[2].substring(2,args[2].length-1) && !user.user.bot && !properties.UserExceptions.includes(user.user.id)) {
					properties.UserExceptions.push(user.user.id);
					message.reply(embed.setDescription(`Added user '${user.user.tag}' as an exception.`));
				} else {
					message.reply(embed.setDescription(`User '${user.user.tag}' is either already an exception or a bot.`));
				}
			});
		} else if (args[1] === "delete") {
			var UserExceptionsOldLen = properties.UserExceptions.length
			message.guild.members.cache.forEach(user => {
				if (user.user.id === args[2].substring(2,args[2].length-1) && !user.user.bot) {
					if (properties.UserExceptions.includes(user.user.id)) {
						properties.UserExceptions.splice(properties.UserExceptions.indexOf(user.user.id),1);
						message.reply(embed.setDescription(`Removed user '${user.user.tag}' as an exception.`));
					} else {
						message.reply(embed.setDescription(`User '${user.user.tag}' is not an exception.`));
					}
				}
			});
			if (UserExceptionsOldLen === properties.UserExceptions.length) {
				message.reply(embed.setDescription(`User '${args[2]}' is not an exception.`));
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
			};
			message.reply(embed.setDescription(UserExceptionsStr));
		}
	} else if (args[0] === "bannedwords") {
		if (args[1] === "add") {
			if (args[1] in banned_words.words) {
				message.reply(embed.setDescription(`That word is already banned.`));
			} else {
				banned_words.words.push(args[1])
				message.reply(embed.setDescription(`Banned that word.`));
			}
		} else if (args[1] === "delete") {
			if (args[1] in banned_words.words) {
				banned_words.words.splice(banned_words.words.indexOf(args[1],1))
				message.reply(embed.setDescription(`Unbanned that word.`));
			} else {
				message.reply(embed.setDescription(`That word is not banned.`));
			}
		}
	} else if (args[0] === "increment") {
		if (!isNaN(args[1]) && Number(args[1]) >= 0) {
			message.reply(embed.setDescription(`Points now increase by ${args[1]}.`));
		} else {
			message.reply(embed.setDescription(`${args[1]} is not a number.`));
		}
	} else if (args[0] === "reset") {
		let default_properties = {ServerAddress:'woohoocraft.hopto.org', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5};
		fs.writeFileSync(`guilds/${guild.id}/configuration.json`, JSON.stringify(default_properties), {flag: 'w'}, function(err, result) {
			if(err) console.log('error', err);
		});
		
		let banned_words = {'words': ["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
		fs.writeFileSync(`guilds/${guild.id}/banned_words.json`, JSON.stringify(banned_words), {flag: 'w'}, function(err, result) {
			if(err) console.log('error', err);
		});

		message.reply(embed.setDescription(`Reset configuration and banned words.`));
	} else {
		message.reply(embed.setDescription("Unknown command. Check your spelling/syntax."));
	};
}

module.exports = {
	name: 'config',
	description: "this is a configuration command!",
	execute(message, args){
		let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
		let banned_words_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
		var properties = JSON.parse(properties_raw);
		var banned_words = JSON.parse(banned_words_raw);
		var configUsed = false;
		message.guild.roles.cache.forEach(role => {
			if (!configUsed && (message.member.roles.cache.has(role.id) && properties.AdminRoles.includes(role.name))) {
				useConfig(message, args);
				configUsed = true
			}
		});
		message.guild.members.cache.forEach(member => {
			if (!configUsed && properties.UserExceptions.includes(member.user.id)) {
				useConfig(message, args);
				configUsed = true
			}
		});
		if (!configUsed) {
			const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		};
		let properties_new = {
			"ServerAddress" : properties.ServerAddress,
			"AdminRoles" : properties.AdminRoles,
			"UserExceptions" : properties.UserExceptions
		};
		let banned_words_new = {
			"words" : banned_words.words
		};
		let properties_string = JSON.stringify(properties_new);
		let banned_words_string = JSON.stringify(banned_words_new);
		fs.writeFile(`./guilds/${message.guild.id}/configuration.json`, properties_string, function(err, result) {
			if(err) console.log('error', err);
		});
		fs.writeFile(`./guilds/${message.guild.id}/banned_words.json`, banned_words_string, function(err, result) {
			if(err) console.log('error', err);
		});
	}
}
