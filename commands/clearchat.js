// Require modules
const fs = require('fs');

module.exports = {
	name: 'clearchat',
	description: "Deletes a certain number preceding messages.",
	viewable: false,
	admin: true,
	subcommands: '[Value]',
	async execute(client, message, args, Discord, replyEmbed){
		if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[]};
		};
		
		// Check permissions and delete messages
		if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			if (!isNaN(args[0]) && parseInt(args[0]) >= 0) { // Check for number then delete
				message.channel.messages.fetch({ limit: parseInt(args[0]) }).then(messages => {
					message.channel.bulkDelete(messages)
				});
				message.reply(replyEmbed.setColor(0x003CFF).setTitle('Clear Chat').setDescription(`Cleared ${args[0]} messages.`));
				return 'Good';
			} else return 'Unknown';
		} else return 'Permission';;
	}
}
