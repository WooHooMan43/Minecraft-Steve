module.exports = {
	name: 'nick',
	description: "this is a nick command!",
	async execute(client, message, args, Discord){
        if (args[0] != undefined && message.guild.ownerID !== message.member.id) {
			message.member.setNickname(args.join(' '))
			const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Nickname').setDescription(`You will now be known as '${args.join(' ')}'.`);
			message.reply(embed);
        } else if (args[0] == undefined) {
			const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Nickname').setDescription(`You will no longer be known as '${message.member.nickname}'.`); // Need this before to display their old nickname
			message.member.setNickname('');
			message.reply(embed);
		} else {
			const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Nickname').setDescription(`Unable to change your nickname.`);
			message.reply(embed);
		}
	}
}
