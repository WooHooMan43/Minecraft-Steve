// Require modules
const profileModel = require('../models/profileSchema');

//to round up to two decimal places. Courtesy of Rodaine and Community on StackOverflow
function money_round(num) {
	if (!isNaN(num)) return Math.ceil(num * 100) / 100;
}

// Create a random function for arrays (found on stackoverflow)
Array.prototype.random = function () {
	return this[Math.floor((Math.random()*this.length))];
}

module.exports = {
	name: 'give',
	description: 'Give member(s) money.',
	access: [true, false],
	cooldown: 10,
	subcommands: {'[@User] [Value]': 'Give a certain member money.', 'all [Value]': 'Give every member money.', '[Number] [Value]': 'Give a certain number of members money.'},
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0];
		let profileData = data[1];

		var otherMembersList = Array.from(message.guild.members.cache.filter(member => !member.user.bot && member.user.id != message.member.id).values());

		let amount = money_round(Number(args[1]));
		let recipient = message.mentions.members.first();
		if (recipient && args[0].replace(/[<!@>]/g, '') === recipient.user.id && !recipient.user.bot && amount >= 0 && profileData.coins >= amount) {
			const response = await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $inc: { coins : -amount } }, { new: true });
			await profileModel.findOneAndUpdate({ userID: recipient.user.id, serverID: message.guild.id }, { $inc: { coins : amount } }, { new: true });
			message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Given **${serverData.Currency.symbol}**${amount} to <@${message.author.id}>.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${response.bank}`, true));
		} else if (parseInt(args[0]) > 0 && amount >= 0 && profileData.coins >= amount) {
			let numberOfRecipients = parseInt(args[0]);
			let amountPerRecipient = Math.floor( (amount / numberOfRecipients) * 100) / 100;

			let recipients = [];

			while (recipients.length < numberOfRecipients) {
				if (otherMembersList.length == recipients.length) break;
				let selectedRecipient = otherMembersList.random();
				if (!(selectedRecipient in recipients)) {
					recipients.push(selectedRecipient.user.id);
				};
			};

			if (recipients.length > 0) {
				const response = await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $inc: { coins : -amount } }, { new: true });

				recipients.forEach(async function (memberID) {
					await profileModel.findOneAndUpdate({ userID: memberID, serverID: message.guild.id }, { $inc: { coins: amountPerRecipient } }, { new: true });
				});

				message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Given **${serverData.Currency.symbol}**${amountPerRecipient} to ${recipients.length} users.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${response.bank}`, true));
			} else {
				message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Not enough users to give to.`).addField('Wallet', `**${serverData.Currency.symbol}**${profileData.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${profileData.bank}`, true));
			}
		} else if (args[0] === 'all' && amount >= 0 && profileData.coins >= amount) {
			if (otherMembersList.length > 0) {
				let amountPerRecipient = Math.floor( (amount / otherMembersList.length) * 100) / 100;
				
				const response = await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $inc: { coins : -amount } }, { new: true });
				
				otherMembersList.forEach(async function (member) {
					await profileModel.findOneAndUpdate({ userID: member.user.id, serverID: message.guild.id }, { $inc: { coins: amountPerRecipient } }, { new: true });
				});

				message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Given **${serverData.Currency.symbol}**${amountPerRecipient} to ${otherMembersList.length} users.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${response.bank}`, true));
			} else {
				message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Not enough users to give to.`).addField('Wallet', `**${serverData.Currency.symbol}**${profileData.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${profileData.bank}`, true));
			}
		} else return 'Unknown';
	}
}
