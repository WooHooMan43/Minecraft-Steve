const Discord = require('discord.js');

const fs = require('fs');

const base64ToImage = require('base64-to-image');

function useShop(message, args, serverpoints, shopitems) {
	// if (args.length === 0) {
	// 
	// } else 
	// if (args[0] === 'add') {
	// 	if (args[1] === 'role') {
	// 		message.guild.roles.create({
	// 			data: {
	// 				name: args.slice(4).join(' '),
	// 				color: parseInt(args[3], 16),
	// 				hoist: true
	// 			}
	// 		});
	// 		let newrole = message.guild.roles.cache.find(role => role.name === args.slice(4).join(' '))
	// 		shopitems.Shown[newrole.id] = args[2]
	// 	}
	// }
	return [serverpoints, shopitems]
}

module.exports = {
	name: 'shop',
	description: "displays the shop!",
	execute(message, args){
		if (fs.existsSync(`guilds/${message.guild.id}/configuration.json`)) {
			let properties_raw = fs.readFileSync(`./guilds/${message.guild.id}/configuration.json`);
			var properties = JSON.parse(properties_raw);
		} else {
			var properties = {ServerAddress:'play.woohoocraft.net', AdminRoles:["Admin","Administrator","Owner","Supreme Councilmen"], UserExceptions:[], PointsIncrement:5, BannedWords:["fag","retard","nigger","nigga","niger","nibba","niga","nibber","niber","whore"]};
		};
		if (fs.existsSync(`guilds/${message.guild.id}/points.json`)) {
			let serverpoints_raw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
			var serverpoints = JSON.parse(serverpoints_raw);
		} else {
			var serverpoints = {};
		};
		if (fs.existsSync(`guilds/${message.guild.id}/shop.json`)) {
			let shopitems_raw = fs.readFileSync(`./guilds/${message.guild.id}/points.json`);
			var shopitems = JSON.parse(shopitems_raw);
		} else {
			var shopitems = {Shown:{}, Hidden:{}}
		};
		
		if (message.member.roles.cache.some(role => properties.AdminRoles.includes(role.name)) || properties.UserExceptions.includes(message.member.id) || message.guild.ownerID == message.member.id) {
			useShop(message, args, serverpoints, shopitems)
		} else {
			const embed = new Discord.MessageEmbed().setColor(0xFFC300).setTitle('Shop').setDescription("You do not have permission to use this command.");
			message.reply(embed);
		};

		let serverpointsStr = JSON.stringify(shopresult[0]);
		fs.writeFileSync(`./guilds/${message.guild.id}/points.json`, serverpointsStr, function(err, result) {
			if(err) console.log('error', err);
			console.log(`Saved points of ${message.guild.name}.`)
		});
		let shopitemsStr = JSON.stringify(shopresult[1]);
		fs.writeFileSync(`./guilds/${message.guild.id}/shop.json`, shopitemsStr, function(err, result) {
			if(err) console.log('error', err);
			console.log(`Saved shop of ${message.guild.name}.`)
		})
	}
}