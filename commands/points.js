const fs = require('fs');

module.exports = {
	name: 'points',
	description: "this is a points management command!",
	execute(message, args, properties){
		let serverpointsraw = fs.readFileSync('guilds/' + message.guild + '/points.json');
		var serverpoints = JSON.parse(serverpointsraw);
		for (var key in serverpoints) {
			var points = serverpoints[key];
			var pointsUsed = false;
			if (message.author.id == key) {
				if (args.length == 0) {
					message.reply(`You have ${(message.author.id in serverpoints) ? points : 0} points.`);
				} else if (args[0] === 'help') {
					message.reply('Points Help:\n' + '- !points help: Displays the points help menu.\n' + '- !points: Get your points.\n' + '- !points user <username and tag>: Get the points of a user.\n' + '- !points add <points> <username and tag>: Add to the points of a user.\n' + '- !points remove <points> <username and tag>: Remove from the points of a user.\n' + '- !points reset <username and tag>: Reset the points of a user.\n')
				} else {
					message.guild.roles.cache.forEach(role => {
						if (!pointsUsed) {
							if (message.member.roles.cache.has(role.id) && properties.AdminRoles.includes(role.name)) {
								if (args[0] === 'add') {
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
											serverpoints[user.user.id] = 0;
											message.reply(`Reset ${user.user.tag}'s points.`);
										}
									});
									if (args.length == 1) {
										serverpoints[message.author.id] = 0;
										message.reply('Reset your points.');
									}
								} else if (args[0] === 'user') {
									message.guild.members.cache.forEach(user => {
										if (user.user.id === args[1].substring(2,args[1].length-1) && !user.user.bot) {
											message.reply(`${user.user.tag} has ${(user.user.id in serverpoints) ? serverpoints[user.user.id] : 0} points.`);
										}
									})
								};
								pointsUsed = true
							}
						}
					});
					message.guild.members.cache.forEach(member => {
						if (!pointsUsed) {
							if (properties.UserExceptions.includes(member.user.id)) {
								if (args[0] === 'add') {
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
											serverpoints[user.user.id] = 0;
											message.reply(`Reset ${user.user.tag}'s points.`);
										}
									});
									if (args.length == 1) {
										serverpoints[message.author.id] = 0;
										message.reply('Reset your points.');
									}
								} else if (args[0] === 'user') {
									message.guild.members.cache.forEach(user => {
										if (user.user.tag === args.slice(1, args.length - 1).join(' ') && !user.user.bot) {
											message.reply(`${user.user.tag} has ${(user.user.id in serverpoints) ? serverpoints[user.user.id] : 0} points.`);
										}
									})
								};
								pointsUsed = true
							}
						}
					});
					if (!pointsUsed) {
						message.reply('You do not have permission to use this command.')
					}
				}
			};
			let serverpointsStr = JSON.stringify(serverpoints);
			fs.writeFileSync("guilds/" + message.guild + "/points.json", serverpointsStr, function(err, result) {
				if(err) console.log('error', err);
			})
		}
	}
}
