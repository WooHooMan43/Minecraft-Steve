// Require modules
const fs = require('fs');

module.exports = {
	name: 'unmute',
	description: "Unmutes a user on the server.",
	viewable: false,
	admin: true,
	subcommands: '[@User] (Reason)',
	async execute(client, message, args, Discord, replyEmbed){
		if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[]};
		};
		if (fs.existsSync(`guilds/${message.guild.id}/muted_users.json`)) {
			let muted_users_raw = fs.readFileSync(`./guilds/${message.guild.id}/muted_users.json`);
			var muted_users = JSON.parse(muted_users_raw);
		} else {
			var muted_users = [];
		};

		if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			let unmutedMember = message.mentions.members.first();
			let unmuteReason = args.slice(1,args.length).join(' ');
			if (unmuteReason == '' || unmuteReason == undefined) unmuteReason = 'Unmuted by moderator'; // If no reason given, use this
			if (!unmutedMember.user.bot) { // Don't unmute bots
				muted_users.splice(muted_users.indexOf(unmutedMember.user.id),1);
				console.log(`Unmuted ${unmutedMember.user.tag} in '${unmutedMember.guild.name}': '${unmuteReason}'.`);
				message.reply(replyEmbed.setColor(0xFF0000).setTitle('Unmute').setDescription(`Unmuted ${unmutedMember.user.tag}: ${unmuteReason}.`));
				
				// Save the list of muted users
				let muted_users_new = JSON.stringify(muted_users);
				fs.writeFileSync(`./guilds/${message.guild.id}/muted_users.json`, muted_users_new, function(err, result) {
					if(err) console.log('error', err);
					console.log(`Saved muted users of ${message.guild.name}.`)
				});
				return 'Good';
			} else return 'Unknown';
		} else return 'Permission';;
	}
}
