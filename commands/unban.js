// Require modules
const fs = require('fs');

module.exports = {
	name: 'unban',
	description: "Unbans a user from the server.",
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
		
		if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) { // Check permissions
			let unbannedMember = message.mentions.members.first();
			let unbanReason = args.slice(1,args.length).join(' ');
			if (unbanReason == '') unbanReason = 'The ban hammer has spoken'; // If no reason given, use this
			if (!unbannedMember.user.bot) { // Don't unban bots
				message.guild.members.unban(unbannedMember, { reason: unbanReason });
				console.log(`Unbanned ${unbannedMember.user.tag} from '${unbannedMember.guild.name}': '${unbanReason}'.`);
				message.reply(replyEmbed.setColor(0xFF0000).setTitle('Unban').setDescription(`Unbanned ${unbannedMember.user.tag}: ${unbanReason}.`));
				return 'Good';
			} else return 'Unknown';
		} else return 'Permission';;
	}
}
