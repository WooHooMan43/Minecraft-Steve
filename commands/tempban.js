// Require modules
const fs = require('fs');

const ms = require('ms');

module.exports = {
	name: 'ban',
	description: "Temporarily bans a user from the server.",
	viewable: false,
	admin: true,
	subcommands: '[@User] [Time] (Reason)',
	async execute(client, message, args, Discord, replyEmbed){
		if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[]};
		};

		if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			if (ms(args[1]) != undefined) { // Check if time is right
				let bannedMember = message.mentions.members.first();
				let banReason = args.slice(2,args.length).join(' ');
				if (banReason == '') banReason = 'The ban hammer has spoken'; // If no reason given, use this
				if (!bannedMember.user.bot) { // Don't ban bots
					message.guild.members.ban(bannedMember, { reason: banReason });

					setTimeout(function(){ // Unban user after time
						message.guild.members.unban(bannedMember);
					}, ms(args[1]));

					console.log(`Banned ${bannedMember.user.tag} from '${bannedMember.guild.name}' for ${ms(args[1])} ms: '${banReason}'.`);
					message.reply(replyEmbed.setColor(0xFF0000).setTitle('Ban').setDescription(`Banned ${bannedMember.user.tag} for ${ms(ms(args[1]))}: ${banReason}.`));
					return 'Good';
				}
			} else return 'Unknown';
		} else return 'Permission';
	}
}
