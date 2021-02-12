// Require modules
const fs = require('fs');

module.exports = (client, Discord) => {
	
	/*
	Get all the events in the events folder and execute them on that event
	*/
	const load_dir = (dirs) => {
		// Get all files in the directory in events
		const event_files = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js'))

		// Make them into events
		for(const file of event_files){
			const event = require(`../events/${dirs}/${file}`)
			const event_name = file.split('.')[0];
			client.on(event_name, event.bind(null, Discord, client))
		};
	}

	['client','guild'].forEach(e => load_dir(e))
}