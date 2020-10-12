const ServerStatus = require('minecraft-server-status');

module.exports = {
	name: 'status',
	description: "gives the status of the selected minecraft server!",
	execute(message, args, address){
		ServerStatus(address, 25565, response => {
			var messageStr = '\n'
			messageStr = messageStr + 'Server Address: ' + address + '\n';
			messageStr = messageStr + 'Status: ';
			if(response.online == true){
				messageStr = messageStr + 'Online:green_circle:' + '\n';
				messageStr = messageStr + 'Version: ' + response.server.name.split(" ").splice(-1) + '\n';
				messageStr = messageStr + 'Players: ' + response.players.now + '/' + response.players.max;
			} else {
				messageStr = messageStr + 'Offline:red_circle:';
			};
			message.reply(messageStr);
		});
	}
}