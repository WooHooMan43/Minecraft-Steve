module.exports = {
	name: 'adminhelp',
	description: "this is a help command!",
	async execute(client, message, args, Discord){
		if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
		};
		
		if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
			const embed = new Discord.MessageEmbed().setColor(0x883C88).setTitle('Advanced Help').addFields({name: '!points help', value: 'View or modify someone\'s points.', inline: true},{name: '!config help', value: 'View or modify the config.', inline: true},{name: '!ban [@User] [Reason]', value: 'Ban a user from the server.', inline: true},{name: '!unban [@User] [Reason]', value: 'Unban a user from the server.', inline: true},{name: '!kick [@User] [Reason]', value: 'Kick a user from the server.', inline: true},{name: '!clearchat [Value]', value: 'Delete a number of messages.', inline: true});
			message.reply(embed);
		} else {
			const embed = new Discord.MessageEmbed().setColor(0x883C88).setTitle('Advanced Help').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		}
	}
}
