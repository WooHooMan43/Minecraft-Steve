const Discord = require('discord.js');

const fs = require('fs');

module.exports = {
	name: 'send',
	description: "this is a nick command!",
	execute(message, args){
        if (fs.existsSync(`guilds/${message.guild.id}/points.json`)) {
			let serverpoints_raw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
			var serverpoints = JSON.parse(serverpoints_raw);
		} else {
			var serverpoints = {};
        };
        var pointsSent = false;
        message.guild.members.cache.forEach(member => {
            if (args[0] != undefined && member.user.id === args[0].replace(/[<@!>]/g, '') && !member.user.bot) {
			    if (!isNaN(args[1]) && parseInt(args[1]) >= 0 && parseInt(args[1]) <= serverpoints[message.member.id]) {
			    	var pointsSent = parseInt(args[1])
			    } else if (args[1] === '*') {
			    	var pointsSent = serverpoints[message.member.id]
			    };
			    serverpoints[message.member.id] -= pointsSent
                serverpoints[member.user.id] += pointsSent
                const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`Sent ${args[1]} points to ${member.user.tag}.`);
                message.reply(embed);
                pointsSent = true
            }
        });
        if (!pointsSent) {
            const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Points').setDescription(`'${message}' is an unknown command. Check your spelling/syntax.`);
            message.reply(embed);
        };
        let serverpointsStr = JSON.stringify(serverpoints);
		fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpointsStr, function(err, result) {
			if(err) console.log('error', err);
			console.log(`Saved points of ${message.guild.name}.`)
		})
	}
}
