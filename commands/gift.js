// Require modules
const fs = require('fs');

// Create a random function for arrays (found on stackoverflow)
Array.prototype.random = function () {
	return this[Math.floor((Math.random()*this.length))];
}

module.exports = {
	name: 'gift',
	description: "this is a gift command!",
	viewable:true,
	admin: false,
	subcommands: {'all [Points]': 'Give everyone (except you and bots) an even, clean portion of points.', 'many [Points] [Number]': 'Give some random users (who are not you or a bot) an even, clean portion of points.', 'one [Points]': 'Give a random user (who is not you or a bot) some points.'},
	async execute(client, message, args, Discord, replyEmbed){
		if (fs.existsSync(`guilds/${message.guild.id}/points.json`)) {
			let serverpoints_raw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
			var serverpoints = JSON.parse(serverpoints_raw);
		} else {
			var serverpoints = {};
		};

		// Get all other non-bot users
		var otherMembersList = Array.from(message.guild.members.cache.filter(member => !member.user.bot && member.user.id != message.member.id).values());
		
		// Get the amount of points given, or set it to the max
		if (!isNaN(args[1]) && parseInt(args[1]) >= 0 && parseInt(args[1]) <= serverpoints[message.member.id]) {
			var pointsGifted = parseInt(args[1])
		} else if (args[1] === '*' || args[1] == undefined) {
			var pointsGifted = serverpoints[message.member.id]
		};
		
		if (args[0] === 'all') { // Give all other members a portion of the points
			let pointsPerMember = otherMembersList.length > 0 ? Math.floor(pointsGifted/otherMembersList.length) : 0;
			serverpoints[message.member.id] -= pointsPerMember*otherMembersList.length;
			otherMembersList.forEach(member => {
				serverpoints[member.user.id] += pointsPerMember
			});
			message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Given ${otherMembersList.length} user(s) ${pointsPerMember} point(s).`));
		} else if (args[0] === 'many') { // Give a select number of other members a portion of the points
			if (!isNaN(args[2]) && parseInt(args[2]) > 1 && parseInt(args[2]) <= otherMembersList.length) {
				var membersGifted = parseInt(args[2])
			} else {
				var membersGifted = otherMembersList.length
			};
			let pointsPerMember = membersGifted > 0 ? Math.floor(pointsGifted/membersGifted.length) : 0;
			serverpoints[message.member.id] -= pointsPerMember*membersGifted;
			let selectedMembers = [];
			while (selectedMembers.length < membersGifted) { // Select random members
				let selectedMember = otherMembersList.random();
				if (!(selectedMember in selectedMembers)) {
					selectedMembers.push(selectedMember)
				}
			};
			selectedMembers.forEach(member => {
				serverpoints[member.user.id] += pointsPerMember
			});
			message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Given ${membersGifted} user(s) ${pointsPerMember} point(s).`));
		} else if (args[0] === 'one') { // Give one other member the points
			serverpoints[message.member.id] -= pointsGifted;
			let selectedMember = otherMembersList.random();
			if (selectedMember != undefined) {
				serverpoints[selectedMember.user.id] += pointsGifted;
				message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Given <@${selectedMember.user.id}> ${args[1]} points.`));
			} else {
				message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Could not find a user.`));
			}
		};

		// Save the points
		let serverpoints_new = JSON.stringify(serverpoints);
		fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpoints_new, function(err, result) {
			if(err) console.log('error', err);
			console.log(`Saved points of ${message.guild.name}.`)
		});
		return 'Good';
	}
}
