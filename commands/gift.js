const Discord = require('discord.js');

const fs = require('fs');

module.exports = {
	name: 'gift',
	description: "this is a nick command!",
	execute(message, args){
		if (fs.existsSync(`guilds/${message.guild.id}/points.json`)) {
			let serverpoints_raw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
			var serverpoints = JSON.parse(serverpoints_raw);
		} else {
			var serverpoints = {};
		};
		const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points');
		if (args[0] === 'all') {
			if (!isNaN(args[1]) && parseInt(args[1]) >= 0 && parseInt(args[1]) <= serverpoints[message.member.id]) {
				var pointsGifted = parseInt(args[1])
			} else if (args[1] === '*') {
				var pointsGifted = serverpoints[message.member.id]
			};
			var otherMembersList = [];
			message.guild.members.cache.forEach(member => {
				if (!member.user.bot && member.user.id != message.member.id) {
					otherMembersList.push(member)
				}
			});
			let pointsPerMember = Math.floor(pointsGifted/(otherMembersList.length));
			serverpoints[message.member.id] -= pointsPerMember*(otherMembersList.length);
			otherMembersList.forEach(member => {
				serverpoints[member.user.id] += pointsPerMember
			});
			message.reply(embed.setDescription(`Given ${otherMembersList.length} users a portion of ${args[1]} points.`));
		} else if (args[0] === 'many') {
			if (!isNaN(args[1]) && parseInt(args[1]) >= 0 && parseInt(args[1]) <= serverpoints[message.member.id]) {
				var pointsGifted = parseInt(args[1])
			} else if (args[1] === '*') {
				var pointsGifted = serverpoints[message.member.id]
			};
			var totalMembers = 0
			message.guild.members.cache.forEach(member => {
				if (!member.user.bot && member.user.id != message.member.id) {
					totalMembers += 1
				}
			});
			if (!isNaN(args[2]) && parseInt(args[2]) > 1 && parseInt(args[2]) <= totalMembers) {
				var membersGifted = parseInt(args[2])
			} else {
				var membersGifted = totalMembers
			};
			let pointsPerMember = Math.floor(pointsGifted/membersGifted);
			serverpoints[message.member.id] -= pointsPerMember*membersGifted;
			let selectedMembers = [];
			while (selectedMembers.length < membersGifted) {
				let selectedMember = message.guild.members.cache.random();
				if (!(selectedMember in selectedMembers) && !selectedMember.user.bot & selectedMember.user.id != message.member.id) {
					selectedMembers.push(selectedMember)
				}
			};
			selectedMembers.forEach(member => {
				serverpoints[member.user.id] += pointsPerMember
			});
			message.reply(embed.setDescription(`Given ${membersGifted} users a portion of ${args[1]} points.`));
		} else if (args[0] === 'one') {
			if (!isNaN(args[1]) && parseInt(args[1]) >= 0 && parseInt(args[1]) <= serverpoints[message.member.id]) {
				var pointsGifted = parseInt(args[1])
			} else if (args[1] === '*') {
				var pointsGifted = serverpoints[message.member.id]
			};
			serverpoints[message.member.id] -= pointsGifted
			let selectedMember = message.guild.members.cache.random();
			serverpoints[selectedMember.user.id] += pointsGifted
			message.reply(embed.setDescription(`Given 1 user ${args[1]} points.`));
		};
        let serverpointsStr = JSON.stringify(serverpoints);
		fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpointsStr, function(err, result) {
			if(err) console.log('error', err);
			console.log(`Saved points of ${message.guild.name}.`)
		})
	}
}
