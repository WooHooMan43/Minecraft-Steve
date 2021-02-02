const fs = require('fs');

module.exports = {
	name: 'unmute',
	description: "this is an unmute command!",
	async execute(client, message, args, Discord){
        if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
        };
        if (fs.existsSync(`guilds/${message.guild.id}/muted_users.json`)) {
			let muted_users_raw = fs.readFileSync(`./guilds/${message.guild.id}/muted_users.json`);
			var muted_users = JSON.parse(muted_users_raw);
		} else {
			var muted_users = [];
        };

        if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
            let unmutedMember = message.mentions.members.first()
            let unmuteReason = args.slice(1,args.length - 1).join(' ')
            if (!unmutedMember.user.bot) {
				muted_users.splice(muted_users.indexOf(unmutedMember.user.id),1);
                console.log(`Unmuted ${unmutedMember.user.tag} in '${unmutedMember.guild.name}': '${unmuteReason}'.`);
                const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Unmute').setDescription(`Unmuted ${unmutedMember.user.tag}: ${unmuteReason}.`);
                message.reply(embed);
            }
        } else {
			const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Unmute').setDescription("You do not have permission to use this command.");
			message.reply(embed);
        };

        let muted_users_new = JSON.stringify(muted_users);
		fs.writeFileSync(`./guilds/${message.guild.id}/muted_users.json`, muted_users_new, function(err, result) {
			if(err) console.log('error', err);
			console.log(`Saved muted users of ${message.guild.name}.`)
		})
	}
}
