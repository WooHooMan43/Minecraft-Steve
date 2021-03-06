// Require modules
const ServerUtils = require('minecraft-server-util');

const parser = require('minecraft-motd-parser');

module.exports = {
	name: 'status',
	description: 'Displays information about a set Minecraft server.',
	access: [true, false],
	cooldown: 60,
	subcommands: '',
	async execute(client, message, args, Discord, replyEmbed, data){
		let serverData = data[0]
		// Get the info from the server
		ServerUtils.status(serverData.ServerAddress).then((response) => {
			if (!(isNaN(response.onlinePlayers))) {
				var motd = '';
				parser.parse(response.description.descriptionText, function(err, result) { // Parse the original motd into JSON
					result.forEach(element => {
						motd += element.string.split('Â')[0]; // Go through each JSON element's string value and remove all chars before the A thing
					});
				});
				// Format the icon and send it
				let image = new Buffer.from(response.favicon.split(',')[1], 'base64');
				const attachment = new Discord.MessageAttachment(image, 'icon.png');
				message.reply(replyEmbed.setTitle(serverData.ServerAddress).setColor(0x28A745).setDescription(motd).addFields({name: 'Version', value: response.version, inline: true},{name: 'Players', value: `${response.onlinePlayers}/${response.maxPlayers}`, inline: true}).attachFiles([attachment]).setThumbnail(`attachment://${attachment.name}`));
			}
		}).catch((error) => { // If server doesn't respond, assume its down and its not my fault
			message.reply(replyEmbed).setTitle(serverData.ServerAddress).setColor(0xDC3545).addFields({name: 'Error', value: 'Sorry, but I can\'t find any information on this server. It might be offline.', inline: true});
			throw error;
		});
		return 'Good';
	}
}