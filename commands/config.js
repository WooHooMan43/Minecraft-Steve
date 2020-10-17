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
						message.reply("Config Help:\n" + "-config server: Changes server to use !status on.\n" + "-config adminroles (add/delete/list) (name): Change which roles have permission to edit the config.\n" + "-config userexceptions (add/delete/list) (name): Change which users have permission to edit the config.\n");
					} else if (args[0] === "server") {
						properties.ServerAddress = args[1];
						message.reply("Server set to '" + args[1] + "'.");
					} else if (args[0] === "adminroles") {
						if (args[1] === "add") {
							properties.AdminRoles.push(args[2]);
							message.reply("Added '" + args[2] + "' to administrative roles.");
						} else if (args[1] === "delete") {
							if (args[2] in properties.AdminRoles) {
								properties.AdminRoles.pop(args[2]);
								message.reply("Removed '" + args[2] + "' from administrative roles.");
							} else {
								message.reply("Role '" + args[2] + "' is not an administrative role.");
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
							message.reply(AdminRolesStr);
						} else {
							message.reply("Unknown command. Check your spelling/syntax.");
						}
					} else if (args[0] === "userexceptions") {
						if (args[1] === "add") {
							message.guild.members.cache.forEach(member => {
								if (member.user.tag === args[2]) {
									properties.UserExceptions.push(member.user.id);
									message.reply("Added user '" + member.user.tag + "' as an exception.");
								}
							});
						} else if (args[1] === "delete") {
							var UserExceptionsOldLen = properties.UserExceptions.length
							message.guild.members.cache.forEach(member => {
								if (member.user.tag === args[2]) {
									if (properties.UserExceptions.includes(member.user.id)) {
										properties.UserExceptions.pop(member.user.id);
										message.reply("Removed user '" + member.user.tag + "' as an exception.");
									}
								}
							});
							if (UserExceptionsOldLen === properties.UserExceptions.length) {
								message.reply("User '" + args[2] + "' is not an exception.");
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
						message.reply(UserExceptionsStr);
						}
					} else {
							message.reply("Unknown command. Check your spelling/syntax. arg ");
					};
					configUsed = true
				}
			}
		});
		message.guild.members.cache.forEach(member => {
			if (!configUsed) {
				if (properties.UserExceptions.includes(member.user.id)) {
					if (args[0] === "help") {
						message.reply("Config Help:\n" + "-config server: Changes server to use !status on.\n" + "-config adminroles (add/delete/list) (name): Change which roles have permission to edit the config.\n" + "-config userexceptions (add/delete/list) (name): Change which users have permission to edit the config.\n");
					} else if (args[0] === "server") {
						properties.ServerAddress = args[1];
						message.reply("Server set to '" + args[1] + "'.");
					} else if (args[0] === "adminroles") {
						if (args[1] === "add") {
							properties.AdminRoles.push(args[2]);
							message.reply("Added '" + args[2] + "' to administrative roles.");
						} else if (args[1] === "delete") {
							if (args[2] in properties.AdminRoles) {
								properties.AdminRoles.pop(args[2]);
								message.reply("Removed '" + args[2] + "' from administrative roles.");
							} else {
								message.reply("Role '" + args[2] + "' is not an administrative role.");
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
							message.reply(AdminRolesStr);
						} else {
							message.reply("Unknown command. Check your spelling/syntax.");
						}
					} else if (args[0] === "userexceptions") {
						if (args[1] === "add") {
							message.guild.members.cache.forEach(member => {
								if (member.user.tag === args[2]) {
									properties.UserExceptions.push(member.user.id);
									message.reply("Added user '" + member.user.tag + "' as an exception.");
								}
							});
						} else if (args[1] === "delete") {
							var UserExceptionsOldLen = properties.UserExceptions.length
							message.guild.members.cache.forEach(member => {
								if (member.user.tag === args[2]) {
									if (properties.UserExceptions.includes(member.user.id)) {
										properties.UserExceptions.pop(member.user.id);
										message.reply("Removed user '" + member.user.tag + "' as an exception.");
									}
								}
							});
							if (UserExceptionsOldLen === properties.UserExceptions.length) {
								message.reply("User '" + args[2] + "' is not an exception.");
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
						message.reply(UserExceptionsStr);
						}
					} else {
							message.reply("Unknown command. Check your spelling/syntax. arg ");
					};
					configUsed = true
				}
			}
		});
		if (!configUsed) {
			message.reply("You do not have permission to use this command.");
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