// Require modules
const settingsModel = require('../models/settingsSchema');

//to round up to two decimal places. Courtesy of Rodaine and Community on StackOverflow
function money_round(num) {
	if (!isNaN(num)) return Math.ceil(num * 100) / 100;
}

module.exports = {
	name: 'config',
	description: 'this is a configuration command!',
	access: [false, true],
	cooldown: 0,
	subcommands: {'adminroles [add/remove] [Name]': 'Change which roles have permission to edit the config.', 'adminroles list': 'Show which roles have permission to edit the config.', 'userexceptions [add/remove] [@User]': 'Change which users have permission to edit the config.', 'userexceptions list': 'Show which users have permission to edit the config.', 'server [Address]': 'Change the server which !status acquires data from.', 'bannedwords [add/remove] [Word]': 'Change which words are banned from the server.', 'increment [Value]': 'Change the number of pounts given with each message.', 'prefix [Prefix]': 'Change the prefix the bot uses to check for commands.', 'reset': 'Reset the config.'},
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0];

		// Check permissions
		if (message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
			if (args[0] === 'help') { // Display help menu
				for (const [key, value] in this.subcommands.entries()) { // Loop through each subcommand
					replyEmbed.addField(`!${this.name} ${key}`, value, true)
				};
				message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription('Help'));
			} else if (args[0] === 'server') { // Change server address
				const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $set: { ServerAddress: args[1] } }, { new: true });
				message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Server set to '${response.ServerAddress}'.`));
			} else if (args[0] === 'adminroles') { // Alter administrative roles
				if (args[1] === 'add') { // Add a role if it is not in
					let roleAdded = message.mentions.roles.first();
					if (!serverData.AdminRoles.includes(roleAdded.id)) {
						const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $push: { AdminRoles: roleAdded.id } }, { new: true });
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Added role '${roleAdded.name}' to administrative roles.`));
					} else {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Role '${roleAdded.name}' is already an administrative role.`));
					}
				} else if (args[1] === 'remove') { // Remove a role if it is in
					let roleRemoved = message.mentions.roles.first();
					if (serverData.AdminRoles.includes(roleRemoved.id)) {
						const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $pull: { AdminRoles: { $in: roleRemoved.id } } }, { new: true });
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Removed role '${roleRemoved.name}' from administrative roles.`));
					} else {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Role '${roleRemoved.name}' is not an administrative role.`));
					}
				} else if (args[1] === 'list') { // List the roles
					if (serverData.AdminRoles.length > 0) {
						var AdminRolesStr = 'The role(s) with permissions to edit the config is/are';
						message.guild.roles.cache.forEach(role => {
							if (serverData.AdminRoles.includes(role.id)) {
								if (serverData.AdminRoles[serverData.AdminRoles.length - 1] != role.id && serverData.AdminRoles.length > 1) AdminRolesStr += ' ' + role.name + ',';
								else if (serverData.AdminRoles[serverData.AdminRoles.length - 1] == role.id && serverData.AdminRoles.length > 1) AdminRolesStr += ' and ' + role.name + '.';
								else AdminRolesStr += ' ' + role.name + '.';
							}
						})
					} else var AdminRolesStr = 'There are no roles with permissions to edit the config.';
					message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(AdminRolesStr));
				} else return 'Unknown';
			} else if (args[0] === 'userexceptions') { // Alter permitted users
				if (args[1] === 'add') { // Add a user if they are not in
					let memberExcepted = message.mentions.users.first();
					if (!serverData.UserExceptions.includes(memberExcepted.id) && !memberExcepted.bot) {
						const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $push: { UserExceptions: memberExcepted.id } }, { new: true });
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Added user '${memberExcepted.tag}' as an exception.`));
					} else {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`User '${memberExcepted.tag}' is either already an exception or a bot.`));
					}
				} else if (args[1] === 'remove') { // Remove a user if they are in
					let memberUnexcepted = message.mentions.users.first();
					if (serverData.UserExceptions.includes(memberUnexcepted.id) && !memberUnexcepted.bot) {
						const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $pull: { UserExceptions: { $in: memberUnexcepted.id } } }, { new: true });
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Added user '${memberUnexcepted.tag}' as an exception.`));
					} else {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`User '${memberUnexcepted.tag}' is not an exception or a bot.`));
					}
				} else if (args[1] === 'list') { // List the users
					if (serverData.UserExceptions.length > 0) {
						var UserExceptionsStr = 'The user(s) with permissions to edit the config is/are';
						message.guild.members.cache.forEach(member => {
							if (serverData.UserExceptions.includes(member.id)) {
								if (serverData.UserExceptions[serverData.UserExceptions.length - 1] != member.id && serverData.UserExceptions.length > 1) UserExceptionsStr += ' ' + member.user.tag + ',';
								else if (serverData.UserExceptions[serverData.UserExceptions.length - 1] == member.id && serverData.UserExceptions.length > 1) UserExceptionsStr += ' and ' + member.user.tag + '.';
								else UserExceptionsStr += ' ' + member.user.tag + '.';
							}
						})
					} else var UserExceptionsStr = 'There are no users with permissions to edit the config.';;
					message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(UserExceptionsStr));
				} else return 'Unknown';
			} else if (args[0] === 'bannedwords') { // Alter banned words
				if (args[1] === 'add') { // Add a word if it is not in
					if (serverData.BannedWords.includes(args[2])) {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`That word is already banned.`));
					} else {
						const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $push: { BannedWords: args[2] } }, { new: true });
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Banned that word.`));
					}
				} else if (args[1] === 'remove') { // Remove a word if it is in
					if (serverData.BannedWords.includes(args[2])) {
						const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $pull: { BannedWords: { $in: args[2] } } }, { new: true });
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Unbanned that word.`));
					} else {
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`That word is not banned.`));
					}
				}
			} else if (args[0] === 'increment') { // Alter the increment of money for a message
				let increment = money_round(Number(args[1]));
				if (!isNaN(args[1]) && increment >= 0) {
					const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { PointsIncrement: increment }, { new: true });
					message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`${serverData.Currency.symbol}${response.PointsIncrement} will now be given for a message.`));
				} else {
					message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`${args[1]} is not a valid number.`));
				}
			} else if (args[0] === 'prefix') { // Alter the prefix for a command
				if (args[1] !== undefined) {
					const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { Prefix: args[1] }, { new: true });
					message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`The command prefix is now ${response.Prefix}.`));
				} else return 'Unknown';
			} else if (args[0] === 'currency') { // Alter the name or the symbol of the currency
				if (args[1] === 'symbol') {
					if (args[2] !== undefined) {
						const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $set: { 'Currency.symbol': args[2] } }, { new: true });
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`The symbol of ${response.Currency.name} is now ${response.Currency.symbol}.`));
					} else return 'Unknown';
				} else if (args[1] === 'name') {
					let currencyName = args.slice(2).join(' ');
					if (currencyName !== undefined) {
						const response = await settingsModel.findOneAndUpdate({ serverID: message.guild.id }, { $set: { 'Currency.name': currencyName } }, { new: true });
						message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`The name of the currency is now ${response.Currency.name}.`));
					} else return 'Unknown';
				} else return 'Unknown';
			} else if (args[0] === 'reset') { // Reset the settings
				let server = await settingsModel.findOneAndRemove({ serverID: message.guild.id });
				server = await settingsModel.create({
					serverID: message.guild.id
				});
				server.save();
				message.reply(replyEmbed.setColor(0x003CFF).setTitle('Config').setDescription(`Reset configuration and banned words.`));
			} else return 'Unknown';
			return 'Good';
		} else return 'Permission';;
	}
}
