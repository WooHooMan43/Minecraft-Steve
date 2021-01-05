const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '!';

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commands/${file}`)

	client.commands.set(command.name, command)
};

client.once('ready', () => {

	client.user.setPresence({
		activity: {
			name: "Minecraft",
			type: 0
		}
	});

	fs.mkdirSync('guilds', {recursive: true});
	client.guilds.cache.forEach(guild => {
		fs.mkdirSync(`guilds/${guild.id}`, {recursive: true});

		if (!fs.existsSync(`guilds/${guild.id}/points.json`)) {
			fs.writeFileSync(`guilds/${guild.id}/points.json`, '{}', {flag: 'w'}, function(err, result) {
				if(err) console.log('error', err);
			})
		};

		let userpoints_raw = fs.readFileSync(`guilds/${guild.id}/points.json`);
		let userpoints = JSON.parse(userpoints_raw);
		
		let default_properties = {ServerAddress:'woohoocraft.hopto.org', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5};
		if (!fs.existsSync(`guilds/${guild.id}/configuration.json`)) {
			fs.writeFileSync(`guilds/${guild.id}/configuration.json`, JSON.stringify(default_properties), {flag: 'w'}, function(err, result) {
				if(err) console.log('error', err);
			})
		};

		let banned_words = {'words': ["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
		if (!fs.existsSync(`guilds/${guild.id}/banned_words.json`)) {
			fs.writeFileSync(`guilds/${guild.id}/banned_words.json`, JSON.stringify(banned_words), {flag: 'w'}, function(err, result) {
				if(err) console.log('error', err);
			})
		};

		guild.members.cache.forEach(member => {
			if (member.user.id !== client.user.id && !member.user.bot) {
				if (!(member.user.id in userpoints)) {
					userpoints[member.user.id] = 0;
				};

				let userpoints_new = JSON.stringify(userpoints);
				fs.writeFileSync(`guilds/${guild.id}/points.json`, userpoints_new, function(err, result) {
					if(err) console.log('error', err);
				})
			}
		})
	})
})

client.on('message', message => {
	if(!message.content.startsWith(prefix) || message.author.bot) {
		let points_raw = fs.readFileSync(`guilds/${message.guild.id}/points.json`)
		let points = JSON.parse(points_raw);

		let properties_raw = fs.readFileSync(`guilds/${guild.id}/configuration.json`);
		let properties = JSON.parse(properties_raw);
		let points_increment = properties.PointsIncrement

		let banned_words_raw = fs.readFileSync(`guilds/${message.guild.id}/banned_words.json`);
		let banned_words = JSON.parse(banned_words_raw)

		banned_words.words.forEach(word => {
			let user_message = message.content.split(' ').join('').toLowerCase();
			if (user_message.includes(word)) {
				message.delete().then(msg => console.log(`Deleted ${msg.author.tag}'s message in '${msg.guild.name}' containing '${word}'.`))
			}
		});
		if (message.author.id in points) {
			points[message.author.id] += points_increment
		} else {
			points[message.author.id] = points_increment
		}

		save_points = JSON.stringify(points);
		fs.writeFileSync(`guilds/${message.guild.id}/points.json`, save_points, function(err, result) {
			if(err) console.log('error', err);
		});
		return
	};

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		client.commands.get('ping').execute(message, args);
	} else if (command === 'status') {
		client.commands.get('status').execute(message, args);
	} else if(command === 'config') {
		client.commands.get('config').execute(message, args);
	} else if(command === 'points') {
		client.commands.get('points').execute(message, args);
	} else if(command === 'help') {
		client.commands.get('help').execute(message, args);
	} else if(command === 'poll') {
		client.commands.get('poll').execute(message, args);
	} else {
		message.reply('Unknown command. Check your spelling/syntax.')
	}
});

// LEAVE AT END
client.login('NjY2MDYxMjE2NzgyNzQ1NjM4.Xhur2A.w5Z2yrJN1FSJfp7JZCr_G5rAaR0');
