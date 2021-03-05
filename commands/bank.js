// Require modules
const profileModel = require('../models/profileSchema');

//to round up to two decimal places. Courtesy of Rodaine and Community on StackOverflow
function money_round(num) {
	if (!isNaN(num)) return Math.ceil(num * 100) / 100;
}

module.exports = {
	name: 'bank',
	description: 'View, deposit, and withdraw money in your wallet and bank.',
	access: [true, true],
	cooldown: 10,
	subcommands: {'deposit [Value]': 'Deposit money into your bank.', 'withdraw [Value]': 'Withdraw money from your bank.', 'send [@User] [Value]': 'Send money to the bank of a member.', '[@User]': 'View the bank of a member.', '[@User] [give/take/set] [Value]': 'Modify the bank of a member.'},
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0];
		let profileData = data[1];

		if (args[0] === undefined) {
			message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).addField('Wallet', `**${serverData.Currency.symbol}**${profileData.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${profileData.bank}`, true));
			return 'Good';
		} else if (args[0] === 'deposit') {
			let deposit = money_round(Number(args[1]));
			if (deposit >= 0 && profileData.coins >= deposit) { // Check for number then delete
				const response = await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $inc: { coins : -deposit, bank: deposit } }, { new: true });
				message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Deposited **${serverData.Currency.symbol}**${deposit} into your bank.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${response.bank}`, true));
				return 'Good';
			} else return 'Unknown';
		} else if (args[0] === 'withdraw') {
			let withdrawl = money_round(Number(args[1]));
			if (withdrawl >= 0 && profileData.bank >= withdrawl) { // Check for number then delete
				const response = await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $inc: { coins : withdrawl, bank: -withdrawl } }, { new: true });
				message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Withdrew **${serverData.Currency.symbol}**${withdrawl} from your bank.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${response.bank}`, true));
				return 'Good';
			} else return 'Unknown';
		} else if (args[0] === 'send') {
			let transfer = money_round(Number(args[2]));
			let recipient = message.mentions.members.first();
			if (recipient && args[1].replace(/[<!@>]/g, '') === recipient.user.id && !recipient.user.bot && transfer >= 0 && profileData.bank >= transfer) {
				let response = await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $inc: { bank: -transfer } }, { new: true });
				await profileModel.findOneAndUpdate({ userID: recipient.user.id, serverID: message.guild.id }, { $inc: { bank: transfer } });
				message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Transferred **${serverData.Currency.symbol}**${transfer} into <@${recipient.user.id}>'s bank.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${response.bank}`, true));
			} else return 'Unknown';
		} else if ((message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id)) {
			let amount = money_round(Number(args[2]));
			let recipient = message.mentions.members.first();
			if (recipient && args[0].replace(/[<!@>]/g, '') === recipient.user.id && !recipient.user.bot) {
				if (args[1] === undefined) {
					let response = await profileModel.findOne({ userID: recipient.user.id, serverID: message.guild.id });
					message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).addField('Wallet', `**${serverData.Currency.symbol}**${recieverData.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${receiverData.bank}`, true));
				} else if (args[1] === 'give') {
					let response = await profileModel.findOneAndUpdate({ userID: recipient.user.id, serverID: message.guild.id }, { $inc: { bank: amount } }, { new: true });
					message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Added **${serverData.Currency.symbol}**${amount} to <@${recipient.user.id}>'s bank.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${response.bank}`, true));
				} else if (args[1] === 'take') {
					let response = await profileModel.findOneAndUpdate({ userID: recipient.user.id, serverID: message.guild.id }, { $inc: { bank: -amount } }, { new: true });
					message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Removed **${serverData.Currency.symbol}**${amount} from <@${recipient.user.id}>'s bank.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${response.bank}`, true));
				} else if (args[1] === 'set') {
					let response = await profileModel.findOneAndUpdate({ userID: recipient.user.id, serverID: message.guild.id }, { $set: { bank: amount } }, { new: true });
					message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Removed **${serverData.Currency.symbol}**${amount} from <@${recipient.user.id}>'s bank.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${response.bank}`, true));
				} else return 'Unknown';
			} else return 'Unknown';
		} else return 'Unknown';
	}
}
