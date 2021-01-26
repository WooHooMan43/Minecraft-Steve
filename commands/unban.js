const Discord = require('discord.js');

const fs = require('fs');

function unbanUser(message, args) {
    message.guild.members.cache.forEach(user => {
        let unbanReason = args.slice(1,args.length - 1).join(' ')
        if (args[0] != undefined && user.user.id === args[0].replace(/[<@!>]/g, '')  && !user.user.bot) {
            message.guild.members.unban(user, { reason: unbanReason }).then(unbannedUser => console.log(`Unbanned ${unbannedUser.user.tag} from '${unbannedUser.guild.name}': '${unbanReason}'.`))
            const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Unban').setDescription(`Unbanned ${user.user.tag}: ${unbanReason}.`);
            message.reply(embed);
        }
    })
}

module.exports = {
	name: 'unban',
	description: "this is an unban command!",
	execute(message, args){
        var userUnbanned = false
        message.guild.roles.cache.forEach(role => {
			if (!userUnbanned && (message.member.roles.cache.has(role.id) && properties.AdminRoles.includes(role.name))) {
                unbanUser(message, args)
                userUnbanned = true
			}
		});
		message.guild.members.cache.forEach(member => {
			if (!userUnbanned && properties.UserExceptions.includes(member.user.id)) {
                unbanUser(message, args)
                userUnbanned = true
			}
		});
		if (!userUnbanned) {
			const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		}
	}
}
