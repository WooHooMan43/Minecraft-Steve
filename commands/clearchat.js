const Discord = require('discord.js');

const fs = require('fs');

function clearChat(message, args) {
    if (!isNaN(args[0]) && parseInt(args[0]) >= 0) {
        message.channel.messages.fetch({ limit: parseInt(args[0]) }).then(messages => {
            message.channel.bulkDelete(messages)
        });
        const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Clear Chat').setDescription(`Cleared ${args[0]} messages.`);
        message.reply(embed);
    }
}

module.exports = {
	name: 'clearchat',
	description: "this is a clear chat command!",
	execute(message, args){
        if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
        };
		
		if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
			clearChat(message, args)
		} else {
			const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Clear Chat').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		};
	}
}
