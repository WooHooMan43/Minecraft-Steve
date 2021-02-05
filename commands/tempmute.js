const fs = require('fs');

const ms = require('ms');

module.exports = {
	name: 'tempmute',
	description: "this is a mute command!",
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
			if (ms(args[1]) != undefined) {
				let mutedMember = message.mentions.members.first();
				let muteReason = args.slice(2,args.length).join(' ');
				if (muteReason == '') muteReason = 'Muted by moderator';
            	if (!mutedMember.user.bot) {
					muted_users.push(mutedMember.user.id);

					setTimeout(function(){
						muted_users.splice(muted_users.indexOf(mutedMember.user.id),1);
						
						let muted_users_new = JSON.stringify(muted_users);
						fs.writeFileSync(`./guilds/${message.guild.id}/muted_users.json`, muted_users_new, function(err, result) {
							if(err) console.log('error', err);
							console.log(`Saved muted users of ${message.guild.name}.`)
						})
					}, ms(args[1]))

            	    console.log(`Muted ${mutedMember.user.tag} in '${mutedMember.guild.name}' for ${ms(args[1])} ms: '${muteReason}'.`);
            	    const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Mute').setDescription(`Muted ${mutedMember.user.tag} for ${ms(ms(args[1]))}: ${muteReason}.`);
					message.reply(embed);

					let muted_users_new = JSON.stringify(muted_users);
					fs.writeFileSync(`./guilds/${message.guild.id}/muted_users.json`, muted_users_new, function(err, result) {
						if(err) console.log('error', err);
						console.log(`Saved muted users of ${message.guild.name}.`)
					})
				}
			} else {
				const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Mute').setDescription(`${args[1]} is not a valid time.`);
				message.reply(embed);
			}
        } else {
			const embed = new Discord.MessageEmbed().setColor(0xFF0000).setTitle('Mute').setDescription("You do not have permission to use this command.");
			message.reply(embed);
        };
	}
}
