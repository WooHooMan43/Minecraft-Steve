const fs = require('fs');

const { checkMessage } = require('./../../functions');

module.exports = (Discord, client, message) => {	
    client.user.setPresence({
		activity: {
			name: "Minecraft",
			type: 0
		}
	});
    
    const prefix = '!'

    let muted_users_raw = fs.readFileSync(`guilds/${message.guild.id}/muted_users.json`)
    let muted_users = JSON.parse(muted_users_raw);

    if (muted_users.includes(message.author.id)) {
        message.delete().then(msg => console.log(`Deleted ${msg.author.tag}'s message in '${msg.guild.name}' because they are muted.`));
        return
    } else if (!message.content.startsWith(prefix) && !message.author.bot) {
        checkMessage(message);
		return
	} else if (message.author.bot) return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase()

    const command = client.commands.get(cmd);

    if (command) command.execute(client, message, args, Discord)
}