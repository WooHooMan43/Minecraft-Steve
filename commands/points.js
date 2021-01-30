const Discord = require('discord.js');

const fs = require('fs');

function usePoints(message, args, serverpoints) {
	var foundUser = false;
	const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points');
	message.guild.members.cache.forEach(member => {
		if (args[0] != undefined && member.user.id === args[0].replace(/[<@!>]/g, '') && !member.user.bot) {
			if (args.length <= 1) {
				message.reply(embed.setDescription(`${member.user.tag} has ${serverpoints[member.user.id]} points.`));
			} else if (args[1] === 'add') {
				serverpoints[member.user.id] += parseInt(args[2]);
				message.reply(embed.setDescription(`Added ${args[2]} points to ${member.user.tag}.`).addField('Total', serverpoints[member.user.id], true));
			} else if (args[1] === 'remove') {
				serverpoints[member.user.id] -= parseInt(args[2]);
				message.reply(embed.setDescription(`Removed ${args[2]} points from ${member.user.tag}.`).addField('Total', serverpoints[member.user.id], true));
			} else if (args[1] === 'reset') {
				serverpoints[member.user.id] = 0;
				message.reply(embed.setDescription(`Reset ${member.user.tag} to 0 points.`));
			} else if (args[1] === 'set') {
				serverpoints[member.user.id] = parseInt(args[2]);
				message.reply(embed.setDescription(`Set ${member.user.tag} to ${args[2]} points.`));
			};
			foundUser = true;
		} else if (args[0] === 'help') {
			message.reply(embed.setDescription('Help').addFields({name: '!points [@User]', value: 'Displays the points of a member.', inline: true},{name: '!points [@User] [add/remove/set] [value]', value: 'Modify the points of a user', inline: true},{name: '!points [@User] reset', value: 'Reset the points of a user.', inline: true}));
			foundUser = true;
		};
	});
	if (!foundUser) {
		message.reply(embed.setDescription(`'${message}' is an unknown command. Check your spelling/syntax.`));
	};
	return serverpoints
}

module.exports = {
	name: 'points',
	description: "View your points.",
	execute(message, args){
		if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
		};
		if (fs.existsSync(`guilds/${message.guild.id}/points.json`)) {
			let serverpoints_raw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
			var serverpoints = JSON.parse(serverpoints_raw);
		} else {
			var serverpoints = {};
		};

		if (args.length === 0) {
			const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`You have ${(message.member.id in serverpoints) ? serverpoints[message.member.id] : 0} points.`);
			message.reply(embed);
		} else {
			if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
				serverpoints = usePoints(message, args, serverpoints)
			} else {
				const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription('You do not have permission to use this command.');
				message.reply(embed);
			}
		};

		let serverpointsStr = JSON.stringify(serverpoints);
		fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpointsStr, function(err, result) {
			if(err) console.log('error', err);
			console.log(`Saved points of ${message.guild.name}.`)
		})
	}
}
