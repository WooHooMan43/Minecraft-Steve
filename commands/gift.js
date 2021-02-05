const fs = require('fs');

Array.prototype.random = function () {
	return this[Math.floor((Math.random()*this.length))];
}

module.exports = {
	name: 'gift',
	description: "this is a nick command!",
	async execute(client, message, args, Discord){
		if (fs.existsSync(`guilds/${message.guild.id}/points.json`)) {
			let serverpoints_raw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
			var serverpoints = JSON.parse(serverpoints_raw);
		} else {
			var serverpoints = {};
		};
		var otherMembersList = Array.from(message.guild.members.cache.filter(member => !member.user.bot && member.user.id != message.member.id).values());
		const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points');
		if (args[0] === 'all') {
			if (!isNaN(args[1]) && parseInt(args[1]) >= 0 && parseInt(args[1]) <= serverpoints[message.member.id]) {
				var pointsGifted = parseInt(args[1])
			} else if (args[1] === '*') {
				var pointsGifted = serverpoints[message.member.id]
			};
			let pointsPerMember = otherMembersList.length > 0 ? Math.floor(pointsGifted/otherMembersList.length) : 0;
			serverpoints[message.member.id] -= pointsPerMember*otherMembersList.length;
			otherMembersList.forEach(member => {
				serverpoints[member.user.id] += pointsPerMember
			});
			message.reply(embed.setDescription(`Given ${otherMembersList.length} user(s) ${pointsPerMember} point(s).`));
		} else if (args[0] === 'many') {
			if (!isNaN(args[1]) && parseInt(args[1]) >= 0 && parseInt(args[1]) <= serverpoints[message.member.id]) {
				var pointsGifted = parseInt(args[1])
			} else if (args[1] === '*') {
				var pointsGifted = serverpoints[message.member.id]
			};
			if (!isNaN(args[2]) && parseInt(args[2]) > 1 && parseInt(args[2]) <= otherMembersList.length) {
				var membersGifted = parseInt(args[2])
			} else {
				var membersGifted = otherMembersList.length
			};
			let pointsPerMember = membersGifted > 0 ? Math.floor(pointsGifted/membersGifted.length) : 0;
			serverpoints[message.member.id] -= pointsPerMember*membersGifted;
			let selectedMembers = [];
			while (selectedMembers.length < membersGifted) {
				let selectedMember = otherMembersList.random();
				if (!(selectedMember in selectedMembers)) {
					selectedMembers.push(selectedMember)
				}
			};
			selectedMembers.forEach(member => {
				serverpoints[member.user.id] += pointsPerMember
			});
			message.reply(embed.setDescription(`Given ${membersGifted} user(s) ${pointsPerMember} point(s).`));
		} else if (args[0] === 'one') {
			if (!isNaN(args[1]) && parseInt(args[1]) >= 0 && parseInt(args[1]) <= serverpoints[message.member.id]) {
				var pointsGifted = parseInt(args[1])
			} else if (args[1] === '*') {
				var pointsGifted = serverpoints[message.member.id]
			};
			serverpoints[message.member.id] -= pointsGifted;
			let selectedMember = otherMembersList.random(); 
			if (selectedMember != undefined) {
				serverpoints[selectedMember.user.id] += pointsGifted;
				message.reply(embed.setDescription(`Given <@${selectedMember.user.id}> ${args[1]} points.`));
			} else {
				message.reply(embed.setDescription(`Could not find a user.`));

			}
		};
        let serverpoints_new = JSON.stringify(serverpoints);
		fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpoints_new, function(err, result) {
			if(err) console.log('error', err);
			console.log(`Saved points of ${message.guild.name}.`)
		})
	}
}
