// Require modules
const profileModel = require('../models/profileSchema');

//to round up to two decimal places. Courtesy of Rodaine and Community on StackOverflow
function money_round(num) {
	if (!isNaN(num)) return Math.ceil(num * 100) / 100;
}

module.exports = {
	name: 'wallet',
	description: 'View money in your wallet.',
	access: [true, true],
	cooldown: 10,
	subcommands: {'[@User]': 'View the wallet of a member.', '[@User] [give/take/set] [Value]': 'Modify the wallet of a member.'},
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0];
		let profileData = data[1];

		if (args[0] === undefined) {
			message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).addField('Wallet', `**${serverData.Currency.symbol}**${profileData.coins}`, true));
			return 'Good';
		} else if ((message.member.roles.cache.some(role => serverData.AdminRoles.includes(role.name)) || serverData.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id)) {
			let amount = money_round(Number(args[2]));
			let recipient = message.mentions.members.first();
			if (recipient && args[0].replace(/[<!@>]/g, '') === recipient.user.id && !recipient.user.bot) {
				if (args[1] === undefined) {
					let response = await profileModel.findOne({ userID: recipient.user.id, serverID: message.guild.id });
					message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).addField('Wallet', `**${serverData.Currency.symbol}**${recieverData.coins}`, true));
				} else if (args[1] === 'give') {
					let response = await profileModel.findOneAndUpdate({ userID: recipient.user.id, serverID: message.guild.id }, { $inc: { wallet: amount } }, { new: true });
					message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Added **${serverData.Currency.symbol}**${amount} to <@${recipient.user.id}>'s wallet.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true));
				} else if (args[1] === 'take') {
					let response = await profileModel.findOneAndUpdate({ userID: recipient.user.id, serverID: message.guild.id }, { $inc: { wallet: -amount } }, { new: true });
					message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Removed **${serverData.Currency.symbol}**${amount} from <@${recipient.user.id}>'s wallet.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true));
				} else if (args[1] === 'set') {
					let response = await profileModel.findOneAndUpdate({ userID: recipient.user.id, serverID: message.guild.id }, { $set: { wallet: amount } }, { new: true });
					message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`Removed **${serverData.Currency.symbol}**${amount} from <@${recipient.user.id}>'s wallet.`).addField('Wallet', `**${serverData.Currency.symbol}**${response.coins}`, true));
				} else return 'Unknown';
			} else return 'Unknown';
		} else return 'Unknown';
	}
}
