const Discord = require('discord.js');

require('dotenv').config();

const client = new Discord.Client();

const prefix = '!';

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commands/${file}`)

	client.commands.set(command.name, command)
};

function initializeGuild(guild) {
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
}

client.once('ready', () => {

	client.user.setPresence({
		activity: {
			name: "Minecraft",
			type: 0
		}
	});

	fs.mkdirSync('guilds', {recursive: true});
	client.guilds.cache.forEach(guild => {
		initializeGuild(guild)
	});
	console.log('Steve is online!')
})

client.on('guildCreate', (guild) => {
	initializeGuild(guild)
	console.log(`Steve has been added to '${guild.name}'.`)
})

client.on('message', message => {
	if (!message.content.startsWith(prefix) && !message.author.bot) {
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
		}

		save_points = JSON.stringify(points);
		fs.writeFileSync(`guilds/${message.guild.id}/points.json`, save_points, function(err, result) {
			if(err) console.log('error', err);
		});
		return
	};
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return
	};
	
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		client.commands.get('ping').execute(message, args);
	} else if (command === 'status') {
		client.commands.get('status').execute(message, args);
	} else if (command === 'config') {
		client.commands.get('config').execute(message, args);
	} else if (command === 'points') {
		client.commands.get('points').execute(message, args);
	} else if (command === 'help') {
		client.commands.get('help').execute(message, args);
	} else if (command === 'poll') {
		client.commands.get('poll').execute(message, args);
	} else if (command === 'nick') {
		client.commands.get('nick').execute(message, args);
	} else if (command === 'clearchat') {
		client.commands.get('clearchat').execute(message, args);
	} else if (command === 'ban') {
		client.commands.get('ban').execute(message, args);
	} else if (command === 'unban') {
		client.commands.get('unban').execute(message, args);
	} else if (command === 'kick') {
		client.commands.get('kick').execute(message, args);
	} else if (command === 'adminhelp') {
		client.commands.get('adminhelp').execute(message, args);
	// } else if (command === 'shop') {
	// 	client.commands.get('shop').execute(message, args);
	// } else if (command === 'gift') {
	// 	client.commands.get('gift').execute(message, args);
	} else if (command === 'send') {
		client.commands.get('send').execute(message, args);
	} else {
		const embed = new Discord.MessageEmbed().setColor(0x0FF00).setTitle('Unknown Command').setDescription(`'${message}' is an unknown command. Check your spelling/syntax.`);
		message.reply(embed)
	}
});

// LEAVE AT END
client.login(process.env.DISCORD_TOKEN);
