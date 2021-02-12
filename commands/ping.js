module.exports = {
	name: 'ping',
	description: "this is a ping command!",
	viewable: false,
	admin: false,
	subcommands: '',
	async execute(client, message, args, Discord, replyEmbed){
		message.reply('pong!');
		return 'Good';
	}
}