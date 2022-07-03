const { Client, Intents } = require("discord.js");
const { readdirSync } = require("fs");
require("dotenv").config();

console.log(`[${new Date().toISOString()}] Creating client...`);

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
});

console.log(`[${new Date().toISOString()}] Loading events...`);

/**
 * Get all the events in the events folder and execute them on that event
 * @param {string} dirs
 */
const load_dir = (dirs) => {
	// Get all files in the directory in events
	const event_files = readdirSync(`./events/${dirs}`).filter((file) =>
		file.endsWith(".js")
	);

	// Make them into events
	for (const file of event_files) {
		const event = require(`./events/${dirs}/${file}`);
		const event_name = file.split(".")[0];
		client.on(event_name, event.bind(null, client));
	}
};

for (let dir of ["client", "guild"]) load_dir(dir);

console.log(`[${new Date().toISOString()}] Logging in...`);

// LEAVE AT END

client.login(process.env.DISCORD_TOKEN);
