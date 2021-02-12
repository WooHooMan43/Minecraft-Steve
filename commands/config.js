// Require modules
const fs = require("fs");

module.exports = {
	name: 'config',
	description: "this is a configuration command!",
	viewable: false,
	admin: true,
	subcommands: {'adminroles [add/remove] [Name]': 'Change which roles have permission to edit the config.', 'adminroles list': 'Show which roles have permission to edit the config.', 'userexceptions [add/remove] [@User]': 'Change which users have permission to edit the config.', 'userexceptions list': 'Show which users have permission to edit the config.', 'server [Address]': 'Change the server which !status acquires data from.', 'bannedwords [add/remove] [Word]': 'Change which words are banned from the server.', 'increment [Value]': 'Change the number of pounts given with each message.', 'reset': 'Reset the config.'},
	async execute(client, message, args, Discord, replyEmbed){
		if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
		};

		// Check permissions
		if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
			if (args[0] === "help") { // Display help menu
				for (const [key, value] in this.subcommands.entries()) { // Loop through each subcommand
					replyEmbed.addField(`!${this.name} ${key}`, value, true)
				};
				message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription('Help'));
			} else if (args[0] === "server") { // Change server address
				properties.ServerAddress = args[1];
				message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Server set to '${args[1]}'.`));
			} else if (args[0] === "adminroles") { // Alter administrative roles
				if (args[1] === "add") { // Add a role if it is not in
					if (args[2] in properties.AdminRoles) {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Role '${args[2]}' is already an administrative role.`));
					} else {
						properties.AdminRoles.push(args[2]);	
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Added role '${args[2]}' to administrative roles.`));
					}
				} else if (args[1] === "remove") { // Remove a role if it is in
					if (args[2] in properties.AdminRoles) {
						properties.AdminRoles.splice(properties.AdminRoles.indexOf(args[2]),1);
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Removed role '${args[2]}' from administrative roles.`));
					} else {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Role '${args[2]}' is not an administrative role.`));
					}
				} else if (args[1] === "list") { // List the roles
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
					message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(AdminRolesStr));
				} else return 'Unknown';
			} else if (args[0] === "userexceptions") { // Alter permitted users
				if (args[1] === "add") { // Add a user if they are not in
					let memberExcepted = message.mentions.users.first();
					if (!properties.UserExceptions.includes(memberExcepted.user.id) && !memberExcepted.user.bot) {
						properties.UserExceptions.push(memberExcepted.user.id);
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Added user '${memberExcepted.user.tag}' as an exception.`));
					} else {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`User '${memberExcepted.user.tag}' is either already an exception or a bot.`));
					}
				} else if (args[1] === "remove") { // Remove a user if they are in
					let memberUnexcepted = message.mentions.users.first();
					if (properties.UserExceptions.includes(memberUnexcepted.user.id) && !memberUnexcepted.user.bot) {
						properties.UserExceptions.splice(properties.UserExceptions.indexOf(memberUnexcepted.user.id),1);
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Added user '${memberUnexcepted.user.tag}' as an exception.`));
					} else {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`User '${memberUnexcepted.user.tag}' is not an exception or a bot.`));
					}
				} else if (args[1] === "list") { // List the users
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
					message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(UserExceptionsStr));
				} else return 'Unknown';
			} else if (args[0] === "bannedwords") { // Alter banned words
				if (args[1] === "add") { // Add a word if it is not in
					if (args[2] in properties.BannedWords) {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`That word is already banned.`));
					} else {
						properties.BannedWords.push(args[2])
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Banned that word.`));
					}
				} else if (args[1] === "remove") { // Remove a word if it is in
					if (args[2] in properties.BannedWords) {
						properties.BannedWords.splice(properties.BannedWords.indexOf(args[2],1))
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Unbanned that word.`));
					} else {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`That word is not banned.`));
					}
				}
			} else if (args[0] === "increment") { // Alter the increment of points for a message
				if (!isNaN(args[1]) && parseInt(args[1]) >= 0) {
					properties.PointsIncrement = parseInt(args[1]);
					message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Points now increase by ${args[1]}.`));
				} else {
					message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`${args[1]} is not a number.`));
				}
			} else if (args[0] === "reset") { // Reset the settings
				properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
				message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Reset configuration and banned words.`));
			} else return 'Unknown';

			// Save the settings
			let properties_new = {ServerAddress: properties.ServerAddress, AdminRoles: properties.AdminRoles, UserExceptions: properties.UserExceptions, PointsIncrement: properties.PointsIncrement, BannedWords: properties.BannedWords};;
			fs.writeFile(`./guilds/${message.guild.id}/configuration.json`, JSON.stringify(properties_new), function(err, result) {
				if(err) console.log('error', err);
				console.log(`Saved config of ${message.guild.name}.`)
			});
			return 'Good';
		} else return 'Permission';;
	}
}
