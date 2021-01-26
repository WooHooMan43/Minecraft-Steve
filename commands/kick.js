const Discord = require('discord.js');

const fs = require('fs');

function kickUser(message, args) {
    message.guild.members.cache.forEach(user => {
        let kickReason = args.slice(1,args.length - 1).join(' ')
        if (args[0] != undefined && user.user.id === args[0].replace(/[<@!>]/g, '')  && !user.user.bot) {
            user.kick(kickReason).then(kickedUser => console.log(`Kicked ${kickedUser.user.tag} from '${kickedUser.guild.name}': '${kickReason}'.`))
            const embed = new Discord.MessageEmbed().setColor(0xFF8000).setTitle('Kick').setDescription(`Kicked ${user.user.tag}: ${kickReason}.`);
			message.reply(embed);
        }
    })
}

module.exports = {
	name: 'kick',
	description: "this is a kick command!",
	execute(message, args){
        if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
        };
        var userKicked = false;
		message.guild.roles.cache.forEach(role => {
			if (!userKicked && (message.member.roles.cache.has(role.id) && properties.AdminRoles.includes(role.name))) {
                kickUser(message, args)
                userKicked = true
			}
		});
		message.guild.members.cache.forEach(member => {
			if (!userKicked && properties.UserExceptions.includes(member.user.id)) {
                kickUser(message, args)
                userKicked = true
			}
		});
		if (!userKicked) {
			const embed = new Discord.MessageEmbed().setColor(0x003CFF).setTitle('Config').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		}
	}
}
