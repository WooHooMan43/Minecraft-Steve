const Discord = require('discord.js');

const fs = require('fs');

function clearChat(message, args) {
    if (!isNaN(args[0]) && Number(args[0]) >= 0) {
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
        var chatCleared = false;
		message.guild.roles.cache.forEach(role => {
			if (!chatCleared && (message.member.roles.cache.has(role.id) && properties.AdminRoles.includes(role.name))) {
                clearChat(message, args);
                chatCleared = true
			}
		});
		message.guild.members.cache.forEach(member => {
			if (!chatCleared && properties.UserExceptions.includes(member.user.id)) {
                clearChat(message, args);
                chatCleared = true
			}
		});
		if (!chatCleared) {
			const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		};
	}
}
