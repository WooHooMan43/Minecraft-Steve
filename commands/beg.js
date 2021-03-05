//to round up to two decimal places. Courtesy of Rodaine and Community on StackOverflow
function money_round(num) {
	if (!isNaN(num)) return Math.ceil(num * 100) / 100;
}

module.exports = {
	name: 'beg',
	description: 'Ask a member for money.',
	access: [true, false],
	cooldown: 60,
	subcommands: '[@User] [Value]',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0];
		let profileData = data[1];

		let amount = money_round(Number(args[1]));
		let recipient = message.mentions.members.first();
		if (recipient && args[0].replace(/[<!@>]/g, '') === recipient.user.id && !recipient.user.bot && amount >= 0) {
			message.reply(replyEmbed.setColor(0xFFC300).setTitle(serverData.Currency.name).setDescription(`<@${message.author.id}> is asking <@${recipient.user.id}> for **${serverData.Currency.symbol}**${amount}. \nType \`!give @${message.author.tag} ${amount}\` to accept the offer.`).addField('Wallet', `**${serverData.Currency.symbol}**${profileData.coins}`, true).addField('Bank', `**${serverData.Currency.symbol}**${profileData.bank}`, true));
		} else return 'Unknown';
	}
}
