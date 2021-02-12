// Require modules
const fs = require('fs');

module.exports = (client, Discord) => {
	// Get all files in the command folder
	const command_files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

	// Make them into commands
	for(const file of command_files){
		const command = require(`../commands/${file}`)
		if (command.name) {
			client.commands.set(command.name, command);
		} else {
			continue
		}
	};
}