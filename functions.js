const fs = require('fs');

initializeGuild = (client, guild) => {
    fs.mkdirSync(`guilds/${guild.id}`, {recursive: true});

    if (!fs.existsSync(`guilds/${guild.id}/points.json`)) {
        fs.writeFileSync(`guilds/${guild.id}/points.json`, '{}', {flag: 'w'}, function(err, result) {
            if(err) console.log('error', err);
        })
    };

    let userpoints_raw = fs.readFileSync(`guilds/${guild.id}/points.json`);
    let userpoints = JSON.parse(userpoints_raw);
    
    let default_properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
    if (!fs.existsSync(`guilds/${guild.id}/configuration.json`)) {
        fs.writeFileSync(`guilds/${guild.id}/configuration.json`, JSON.stringify(default_properties), {flag: 'w'}, function(err, result) {
            if(err) console.log('error', err);
        })
    };

    guild.members.cache.forEach(member => {
        if (member.user.id !== client.user.id && !member.user.bot) {
            if (!(member.user.id in userpoints)) {
                userpoints[member.user.id] = 0;
            }				
        }
    });

    let userpoints_new = JSON.stringify(userpoints);
    fs.writeFileSync(`guilds/${guild.id}/points.json`, userpoints_new, function(err, result) {
        if(err) console.log('error', err);
    })
};

checkMessage = (message) => {
    let points_raw = fs.readFileSync(`guilds/${message.guild.id}/points.json`)
	let points = JSON.parse(points_raw);

	let properties_raw = fs.readFileSync(`guilds/${message.guild.id}/configuration.json`);
	let properties = JSON.parse(properties_raw);
	let points_increment = properties.PointsIncrement
	let banned_words = properties.BannedWords

	banned_words.forEach(word => {
		let user_message = message.content.replace(/[^a-zA-Z]/g, "").toLowerCase();
		if (user_message.includes(word)) {
			message.delete().then(msg => console.log(`Deleted ${msg.author.tag}'s message in '${msg.guild.name}' containing '${word}'.`))
		}
	});
	
	if (message.member.id in points) {
		points[message.member.id] += points_increment
	} else {
		points[message.member.id] = points_increment
	};

	save_points = JSON.stringify(points);
	fs.writeFileSync(`guilds/${message.guild.id}/points.json`, save_points, function(err, result) {
		if(err) console.log('error', err);
	});
};

module.exports = { initializeGuild, checkMessage };
