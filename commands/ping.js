module.exports = {
	name: 'ping',
	description: "this is a ping command!",
	async execute(client, message, args, Discord){
		message.reply('pong!');
	}
}