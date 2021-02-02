const fs = require('fs');

initializeGuild = (client, guild) => {
    fs.mkdirSync(`guilds/${guild.id}`, {recursive: true});

    if (!fs.existsSync(`guilds/${guild.id}/points.json`)) {
        fs.writeFileSync(`guilds/${guild.id}/points.json`, '{}', {flag: 'w'}, function(err, result) {
            if(err) console.log('error', err);
        })
    };

    let serverpoints_raw = fs.readFileSync(`guilds/${guild.id}/points.json`);
    let serverpoints = JSON.parse(serverpoints_raw);
    
    let default_properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
    if (!fs.existsSync(`guilds/${guild.id}/configuration.json`)) {
        fs.writeFileSync(`guilds/${guild.id}/configuration.json`, JSON.stringify(default_properties), {flag: 'w'}, function(err, result) {
            if(err) console.log('error', err);
        })
    };

    let muted_users = [];
    if (!fs.existsSync(`guilds/${guild.id}/muted_users.json`)) {
        fs.writeFileSync(`guilds/${guild.id}/muted_users.json`, JSON.stringify(muted_users), {flag: 'w'}, function(err, result) {
            if(err) console.log('error', err);
        })
    };

    guild.members.cache.forEach(member => {
        if (member.user.id !== client.user.id && !member.user.bot) {
            if (!(member.user.id in serverpoints)) {
                serverpoints[member.user.id] = 0;
            }				
        }
    });

    let serverpoints_new = JSON.stringify(serverpoints);
    fs.writeFileSync(`guilds/${guild.id}/points.json`, serverpoints_new, function(err, result) {
        if(err) console.log('error', err);
    })
};

checkMessage = (message) => {
    let serverpoints_raw = fs.readFileSync(`guilds/${message.guild.id}/points.json`)
	let serverpoints = JSON.parse(serverpoints_raw);

	let properties_raw = fs.readFileSync(`guilds/${message.guild.id}/configuration.json`);
	let properties = JSON.parse(properties_raw);
	let points_increment = properties.PointsIncrement
	let banned_words = properties.BannedWords

    let muted_users_raw = fs.readFileSync(`guilds/${message.guild.id}/muted_users.json`)
	let muted_users = JSON.parse(muted_users_raw);

	banned_words.forEach(word => {
		let user_message = message.content.replace(/[^a-zA-Z]/g, "").toLowerCase();
		if (user_message.includes(word)) {
			message.delete().then(msg => console.log(`Deleted ${msg.author.tag}'s message in '${msg.guild.name}' containing '${word}'.`))
		}
    });
    
	if (message.author.id in serverpoints && !(message.author.id in muted_users)) {
		serverpoints[message.member.id] += points_increment
	} else {
		serverpoints[message.member.id] = points_increment
	};

	serverpoints_new = JSON.stringify(serverpoints);
	fs.writeFileSync(`guilds/${message.guild.id}/points.json`, serverpoints_new, function(err, result) {
		if(err) console.log('error', err);
	});
};

module.exports = { initializeGuild, checkMessage };
