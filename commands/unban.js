const Discord = require('discord.js');

const fs = require('fs');

function unbanUser(message, args) {
    message.guild.members.cache.forEach(member => {
        let unbanReason = args.slice(1,args.length - 1).join(' ')
        if (args[0] != undefined && member.user.id === args[0].replace(/[<@!>]/g, '')  && !member.user.bot) {
            message.guild.members.unban(member, { reason: unbanReason }).then(unbannedUser => console.log(`Unbanned ${unbannedUser.user.tag} from '${unbannedUser.guild.name}': '${unbanReason}'.`))
            const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Unban').setDescription(`Unbanned ${member.user.tag}: ${unbanReason}.`);
            message.reply(embed);
        }
    })
}

module.exports = {
	name: 'unban',
	description: "this is an unban command!",
	execute(message, args){
		if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
		};
		
		if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
			unbanUser(message, args)
		} else {
			const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Unban').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		};
	}
}
