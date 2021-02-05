const fs = require('fs');

module.exports = {
	name: 'kick',
	description: "this is a kick command!",
	async execute(client, message, args, Discord){
        if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
		};
		
		if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
			let kickedMember = message.mentions.members.first();
			let kickReason = args.slice(1,args.length).join(' ');
			if (kickReason == '') kickReason = 'Kicked by moderator';
            if (!kickedMember.user.bot) {
				kickedMember.kick(kickReason);
				console.log(`Kicked ${kickedMember.user.tag} from '${kickedMember.guild.name}': '${kickReason}'.`);
				const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Kick').setDescription(`Kicked ${kickedMember.user.tag}: ${kickReason}.`);
				message.reply(embed);
			}
		} else {
			const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Kick').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		}
	}
}
