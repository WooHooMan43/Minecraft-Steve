const fs = require('fs');

module.exports = (Discord, client, message) => {
	const { checkMessage } = require('./../../functions');
	
    const prefix = '!'

    if (!message.content.startsWith(prefix) && !message.author.bot) {
        checkMessage(message);
		return
	};
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase()

    const command = client.commands.get(cmd);

    if (command) command.execute(client, message, args, Discord)
}