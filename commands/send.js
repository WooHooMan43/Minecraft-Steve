// Require modules
const fs = require('fs');

module.exports = {
	name: 'send',
	description: "Sends a member some points.",
	viewable: true,
	admin: false,
	subcommands: '[@User] [Points]',
	async execute(client, message, args, Discord, replyEmbed){
		if (fs.existsSync(`guilds/${message.guild.id}/points.json`)) {
			let serverpoints_raw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
			var serverpoints = JSON.parse(serverpoints_raw);
		} else {
			var serverpoints = {};
		};

		let recievedMember = message.mentions.members.first()
		if (!isNaN(args[1]) && args[1] >= 0 && args[1] <= serverpoints[message.member.id] && !recievedMember.user.bot) { // Send points if its a number
			var pointsSent = parseInt(args[1])
			serverpoints[message.member.id] -= pointsSent
			serverpoints[recievedMember.user.id] += pointsSent
			message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Sent ${args[1]} points to ${recievedMember.user.tag}.`));

			// Save points file
			let serverpoints_new = JSON.stringify(serverpoints);
			fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpoints_new, function(err, result) {
				if(err) console.log('error', err);
				console.log(`Saved points of ${message.guild.name}.`)
			});
			return 'Good';
		} else return 'Unknown';;
	}
}
