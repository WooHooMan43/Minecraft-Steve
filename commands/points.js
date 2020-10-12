const fs = require('fs');

module.exports = {
	name: 'points',
	description: "this is a points management command!",
	execute(message, args){
		let serverpointsraw = fs.readFileSync(message.guild + '/points.json');
		var serverpoints = JSON.parse(serverpointsraw);
		for (var key in serverpoints) {
			var points = serverpoints[key];
			if (message.author.id == key) {
				if (args.length == 0) {
					message.reply(`You have ${(message.author.id in serverpoints) ? points : 0} points.`);
				} else if (args[0] === 'add') {
					message.guild.members.cache.forEach(user => {
					if (user.user.tag === args.slice(2, args.length - 2).join(' ') && !user.user.bot) {
							serverpoints[user.user.id] += parseInt(args[1]);
							message.reply(`Added ${args[1]} points to ${user.user.tag}. Total: ${serverpoints[user.user.id]}`);
						}
					});
					if (args.length <= 2) {
						serverpoints[message.author.id] += parseInt(args[1]);
						message.reply(`Added ${args[1]} to your points. Total: ${serverpoints[message.author.id]}`);
					}
				} else if (args[0] === 'remove') {
					message.guild.members.cache.forEach(user => {
						if (user.user.tag === args.slice(2, args.length - 2).join(' ') && !user.user.bot) {
							serverpoints[user.user.id] -= parseInt(args[1]);
							message.reply(`Removed ${args[1]} points from ${user.user.tag}. Total: ${serverpoints[user.user.id]}`);
						}
					});
					if (args.length <= 2) {
						serverpoints[message.author.id] -= parseInt(args[1]);
						message.reply(`Removed ${args[1]} of your points. Total: ${serverpoints[message.author.id]}`);
					}
				} else if (args[0] === 'reset') {
					message.guild.members.cache.forEach(user => {
						if (user.user.tag === args.slice(1, args.length - 1).join(' ') && !user.user.bot) {
							serverpoints[user.user.id] = 0
							message.reply(`Reset ${user.user.tag}'s points.`);
						}
					});
					if (args.length == 1) {
						serverpoints[message.author.id] = 0
						message.reply('Reset your points.');
					}
				} else {
					message.guild.members.cache.forEach(user => {
						if (user.user.tag === args.join(' ') && !user.user.bot) {
						message.reply(`${user.user.tag} has ${(user.user.id in serverpoints) ? serverpoints[user.user.id] : 0} points.`);
						}
					})
				}
			}
		};
		let serverpointsStr = JSON.stringify(serverpoints);
		fs.writeFileSync("guilds/" + message.guild + "/points.json", serverpointsStr, function(err, result) {
			if(err) console.log('error', err);
		})
	}
}