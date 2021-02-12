// Require modules
const fs = require('fs');

initializeGuild = (client, guild) => {
	/*
	Creates a folder, config, points, and muted_users files for a guild,
	then sets every the points of user who is not in the points file to 0 and saves the file.
	*/
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
	/*
	Gets current points and config settings,
	then deletes messages with banned words or adds points and saves the points file.
	*/
	let properties_raw = fs.readFileSync(`guilds/${message.guild.id}/configuration.json`);
	let properties = JSON.parse(properties_raw);
	let banned_words = properties.BannedWords;

	let stripped_message = message.content.replace(/[^a-zA-Z]/g, "").toLowerCase();
	if (banned_words.some(word => stripped_message.includes(word))) {
		message.delete().then(msg => console.log(`Deleted ${msg.author.tag}'s message in '${msg.guild.name}' containing a banned word.`))
	} else {
		let serverpoints_raw = fs.readFileSync(`guilds/${message.guild.id}/points.json`)
		let serverpoints = JSON.parse(serverpoints_raw);
		let points_increment = properties.PointsIncrement;

		if (message.author.id in serverpoints) {
			serverpoints[message.member.id] += points_increment
		} else {
			serverpoints[message.member.id] = points_increment
		};

		serverpoints_new = JSON.stringify(serverpoints);
		fs.writeFileSync(`guilds/${message.guild.id}/points.json`, serverpoints_new, function(err, result) {
			if(err) console.log('error', err);
		});	
	}
};

module.exports = { initializeGuild, checkMessage };
