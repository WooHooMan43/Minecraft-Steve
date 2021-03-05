module.exports = {
	name: 'ping',
	description: 'this is a ping command!',
	access: [false, false],
	cooldown: 0,
	subcommands: '',
	async execute(client, message, args, Discord, replyEmbed, data){
		message.reply('pong!');
		return 'Good';
	}
}