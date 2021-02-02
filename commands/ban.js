const fs = require('fs');

module.exports = {
	name: 'ban',
	description: "this is a ban command!",
	async execute(client, message, args, Discord){
        if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
        };
        if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
			let bannedMember = message.mentions.members.first();
            let banReason = args.slice(1,args.length - 1).join(' ');
            if (!bannedMember.user.bot) {
				message.guild.members.ban(bannedMember, { reason: banReason });
				console.log(`Banned ${bannedMember.user.tag} from '${bannedMember.guild.name}': '${banReason}'.`);
				const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Ban').setDescription(`Banned ${bannedMember.user.tag}: ${banReason}.`);
				message.reply(embed);
			}
		} else {
			const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Ban').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		}
	}
}
