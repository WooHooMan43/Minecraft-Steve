const fs = require('fs');

module.exports = {
	name: 'unban',
	description: "this is an unban command!",
	async execute(client, message, args, Discord){
		if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
		};
		
		if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
            let unbannedMember = message.mentions.members.first();
            let unbanReason = args.slice(1,args.length - 1).join(' ');
            if (!unbannedMember.user.bot) {
				message.guild.members.unban(unbannedMember, { reason: unbanReason });
				console.log(`Unbanned ${unbannedMember.user.tag} from '${unbannedMember.guild.name}': '${unbanReason}'.`);
				const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Unban').setDescription(`Unbanned ${unbannedMember.user.tag}: ${unbanReason}.`);
				message.reply(embed);
			}
		} else {
			const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Unban').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		};
	}
}
