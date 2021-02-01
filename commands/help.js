module.exports = {
	name: 'help',
	description: "Displays the help menu.",
	async execute(client, message, args, Discord){
		if (args.length == 0) {
			const embed = new Discord.MessageEmbed().setColor(0x883C88).setTitle('Help').addFields({name: '!help', value: 'Displays the help menu.', inline: true},{name: '!status', value: 'Get the status of the Minecraft server.', inline: true},{name: '!points', value: 'View your points.', inline: true},{name: '!poll [YN/2/3/4] [Title] (Options)', value: 'Create a poll with the title and each option separated by semicolons.', inline: true});
			message.reply(embed);
		}
	}
}
