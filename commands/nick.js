module.exports = {
	name: 'nick',
	description: 'Changes a user\'s nickname.',
	access: [true, false],
	cooldown: 60,
	subcommands: '[Name]',
	async execute(client, message, args, Discord, replyEmbed, data){
		if (args[0] != undefined && message.guild.ownerID !== message.member.id) { // Check if they entered a nickname and if they are not the owner
			message.member.setNickname(args.join(' '))
			message.reply(replyEmbed.setColor(0xFFC300).setTitle('Nickname').setDescription(`You will now be known as '${args.join(' ')}'.`));
		} else if (args[0] == undefined) { // Remove nickname if not specified
			message.reply(replyEmbed.setColor(0xFFC300).setTitle('Nickname').setDescription(`You will no longer be known as '${message.member.nickname}'.`)); // Need this before to display their old nickname
			message.member.setNickname('');
		} else { // Basically for if the user is the owner because bots cant change the server owner's information
			message.reply(replyEmbed).setColor(0xFFC300).setTitle('Nickname').setDescription(`Unable to change your nickname.`);
		};
		return 'Good';
	}
}
