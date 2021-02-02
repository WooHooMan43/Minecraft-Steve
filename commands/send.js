const fs = require('fs');

module.exports = {
	name: 'send',
	description: "this is a nick command!",
	async execute(client, message, args, Discord){
        if (fs.existsSync(`guilds/${message.guild.id}/points.json`)) {
			let serverpoints_raw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
			var serverpoints = JSON.parse(serverpoints_raw);
		} else {
			var serverpoints = {};
		};

		let recievedMember = message.mentions.members.first()
		if (!isNaN(args[1]) && args[1] >= 0 && args[1] <= serverpoints[message.member.id] && !recievedMember.user.bot) {
			var pointsSent = parseInt(args[1])
			serverpoints[message.member.id] -= pointsSent
			serverpoints[recievedMember.user.id] += pointsSent
			const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Sent ${args[1]} points to ${recievedMember.user.tag}.`);
			message.reply(embed);
		} else {
        	const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`'${message}' is an unknown command. Check your spelling/syntax.`);
        	message.reply(embed);
		};

        let serverpoints_new = JSON.stringify(serverpoints);
		fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpoints_new, function(err, result) {
			if(err) console.log('error', err);
			console.log(`Saved points of ${message.guild.name}.`)
		})
	}
}
