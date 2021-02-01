const fs = require('fs');

function banUser(message, args, Discord) {
    message.guild.members.cache.forEach(member => {
        let banReason = args.slice(1,args.length - 1).join(' ')
        if (args[0] != undefined && member.user.id === args[0].replace(/[<@!>]/g, '')  && !member.user.bot) {
            message.guild.members.ban(member, { reason: banReason }).then(bannedUser => console.log(`Banned ${bannedUser.user.tag} from '${bannedUser.guild.name}': '${banReason}'.`))
            const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Ban').setDescription(`Banned ${member.user.tag}: ${banReason}.`);
			message.reply(embed);
        }
    })
}

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
			banUser(message, args, Discord)
		} else {
			const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Ban').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		}
	}
}
