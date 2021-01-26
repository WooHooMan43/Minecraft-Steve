const Discord = require('discord.js');

const fs = require('fs');

function banUser(message, args) {
    message.guild.members.cache.forEach(user => {
        let banReason = args.slice(1,args.length - 1).join(' ')
        if (args[0] != undefined && user.user.id === args[0].replace(/[<@!>]/g, '')  && !user.user.bot) {
            message.guild.members.ban(user, { reason: banReason }).then(bannedUser => console.log(`Banned ${bannedUser.user.tag} from '${bannedUser.guild.name}': '${banReason}'.`))
            const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Ban').setDescription(`Banned ${user.user.tag}: ${banReason}.`);
			message.reply(embed);
        }
    })
}

module.exports = {
	name: 'ban',
	description: "this is a ban command!",
	execute(message, args){
        if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
        };
        var userBanned = false;
		message.guild.roles.cache.forEach(role => {
			if (!userBanned && (message.member.roles.cache.has(role.id) && properties.AdminRoles.includes(role.name))) {
                banUser(message, args)
                userBanned = true
			}
		});
		message.guild.members.cache.forEach(member => {
			if (!userBanned && properties.UserExceptions.includes(member.user.id)) {
                banUser(message, args)
                userBanned = true
			}
		});
		if (!userBanned) {
			const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		}
	}
}
