module.exports = {
	name: 'help',
	description: "this is a help command!",
	execute(message, args){
		if (args.length == 0) {
			message.reply('Commands:\n' + '- !help: Displays the help menu.\n' + '- !status: Displays the status of the Minecraft server.\n' + '- !points (help/user/add/remove/reset): Get help or view or modify your or someone else\'s points.\n' + '- !config (help/server/adminroles/userexceptions): Get help or modify the config.')
		}
	}
}
