module.exports = (Discord, client) => {
	// Set presence to 'Playing Minecraft'
	client.user.setPresence({
		activity: {
			name: "Minecraft",
			type: 0
		}
	});
	
	console.log('Steve is online!');
}