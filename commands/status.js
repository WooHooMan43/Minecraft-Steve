const Discord = require('discord.js');

const fs = require('fs');

const ServerUtils = require('minecraft-server-util');

const base64ToImage = require('base64-to-image');

const parser = require('minecraft-motd-parser');

module.exports = {
	name: 'status',
	description: "gives the status of the selected minecraft server!",
	execute(message, args){
		let propertiesraw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
		var properties = JSON.parse(propertiesraw);
		ServerUtils.status(properties.ServerAddress)
    	.then((response) => {
			fs.mkdirSync(`guilds/${message.guild.id}/server-icons`, {recursive: true});			
			if (!(isNaN(response.onlinePlayers))) {
				var motd = '';
				parser.parse(response.description.descriptionText, function(err, result) {
					result.forEach(element => {
						motd += element.string.split("Â")[0];
					});
				});
				let serverIcon = base64ToImage(response.favicon, `guilds/${message.guild.id}/`, {'fileName': 'server-icon', 'type':'png'});
				const attachment = new Discord.MessageAttachment(`guilds/${message.guild.id}/${serverIcon.fileName}`, serverIcon.fileName);
				const embed = new Discord.MessageEmbed().setTitle(properties.ServerAddress).setColor(0x28A745).setDescription(motd).addFields({name: 'Version', value: response.version, inline: true},{name: 'Players', value: `${response.onlinePlayers}/${response.maxPlayers}`, inline: true}).attachFiles(attachment).setThumbnail(`attachment://${serverIcon.fileName}`);
				message.reply(embed);
			}
    	})
    	.catch((error) => {
			const embed = new Discord.MessageEmbed().setTitle(properties.ServerAddress).setColor(0xDC3545).addFields({name: 'Error', value: 'Sorry, but I can\'t find any information on this server. It might be offline.', inline: true});
			message.reply(embed);
			throw error;
    	});
	}
}