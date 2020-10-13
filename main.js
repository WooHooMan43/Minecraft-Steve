const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '!';

const fs = require('fs');

var properties = {ServerAddress:'woohoocraft.hopto.org', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[]};

// console.log(properties)

// console.log(userpoints)

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commands/${file}`)

	client.commands.set(command.name, command)
}

client.once('ready', () => {
	console.log('Steve is online!');
	client.guilds.cache.forEach(guild => {
		fs.mkdirSync('guilds', {recursive: true});
		fs.mkdirSync(`guilds/${guild.id}`, {recursive: true});

		fs.writeFileSync(`guilds/${guild.id}/points.json`, '{}', {flag: 'w'}, function(err, result) {
			if(err) console.log('error', err);
		})
		fs.writeFileSync(`guilds/${guild.id}/configuration.json`, '{}', {flag: 'w'}, function(err, result) {
			if(err) console.log('error', err);
		})

		let userpoints_raw = fs.readFileSync(`guilds/${guild.id}/points.json`)
		userpoints = JSON.parse(userpoints_raw);

		let properties_raw = fs.readFileSync(`guilds/${guild.id}/configuration.json`);
		properties = JSON.parse(properties_raw);

		guild.members.cache.forEach(member => {
			if (member.user.id !== client.user.id && !member.user.bot) {
				if (!(member.user.id in userpoints)) {
					userpoints[member.user.id] = 0;
				}
				savepoints = JSON.stringify(userpoints);
				fs.writeFileSync(`guilds/${guild.id}/points.json`, savepoints, function(err, result) {
					if(err) console.log('error', err);
				})
			}
		})
	})
})

client.on('message', message => {
	if(!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping'){
		client.commands.get('ping').execute(message, args);
	} else if (command === 'status'){
		client.commands.get('status').execute(message, args, properties.ServerAddress);
	} else if(command === 'config'){
		client.commands.get('config').execute(message, args, properties);
	} else if(command === 'points'){
		client.commands.get('points').execute(message, args);
	} else if(command === 'help'){
		client.commands.get('help').execute(message, args);
	} else {
		message.reply('Unknown command. Check your spelling/syntax.')
	}
});

// LEAVE AT END
client.login('NjY2MDYxMjE2NzgyNzQ1NjM4.Xhur2A.w5Z2yrJN1FSJfp7JZCr_G5rAaR0');
