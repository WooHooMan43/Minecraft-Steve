const fs = require('fs');

function kickUser(message, args, Discord) {
    message.guild.members.cache.forEach(member => {
        let kickReason = args.slice(1,args.length - 1).join(' ')
        if (args[0] != undefined && member.user.id === args[0].replace(/[<@!>]/g, '')  && !member.user.bot) {
            member.kick(kickReason).then(kickedUser => console.log(`Kicked ${kickedUser.user.tag} from '${kickedUser.guild.name}': '${kickReason}'.`))
            const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Kick').setDescription(`Kicked ${member.user.tag}: ${kickReason}.`);
			message.reply(embed);
        }
    })
}

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
			kickUser(message, args, Discord)
		} else {
			const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Config').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		}
	}
}
