const fs = require('fs');

const ms = require('ms');

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
			if (ms(args[1]) != undefined) {
				let bannedMember = message.mentions.members.first();
        	    let banReason = args.slice(2,args.length).join(' ');
				if (banReason == '') banReason = 'The ban hammer has spoken';
        	    if (!bannedMember.user.bot) {
					message.guild.members.ban(bannedMember, { reason: banReason });

					setTimeout(function(){
						message.guild.members.unban(bannedMember);
					}, ms(args[1]));

					console.log(`Banned ${bannedMember.user.tag} from '${bannedMember.guild.name}' for ${ms(args[1])} ms: '${banReason}'.`);
					const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Ban').setDescription(`Banned ${bannedMember.user.tag} for ${ms(ms(args[1]))}: ${banReason}.`);
					message.reply(embed);
				}
			} else {
				const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Ban').setDescription(`${args[1]} is not a valid time.`);
				message.reply(embed);
			}
		} else {
			const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Ban').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		}
	}
}
