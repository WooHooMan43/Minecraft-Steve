const {
	Collection,
	ApplicationCommandData,
	Client,
	Interaction,
	InteractionReplyOptions,
} = require("discord.js");
const { readdirSync } = require("fs");

/**
 * @param {any} value
 * @returns {string}
 */
function encode(value) {
	return JSON.stringify(value);
}

/**
 * @param {unknown} value
 * @returns {any}
 */
function decode(value) {
	if (!(value instanceof Buffer)) return value;
	try {
		return JSON.parse(value.toString());
	} catch (e) {
		return value.toString();
	}
}

/**
 * @returns {Collection<string, { data: ApplicationCommandData; execute(client: Client, interaction: Interaction, options: object): Promise<InteractionReplyOptions>; }>}
 */
function getCommands() {
	const commands = new Collection();
	// Get all files in the command folder
	const command_files = readdirSync("./commands").filter((file) =>
		file.endsWith(".js")
	);

	// Make them into commands
	for (const file of command_files) {
		/**
		 * @type {{ data: { name?: string; }; execute(client: Client, interaction: Interaction, options: object): Promise<InteractionReplyOptions>; }}
		 */
		const command = require(`./commands/${file}`);
		if (command.data.name) commands.set(command.data.name, command);
		else continue;
	}
	return commands;
}

module.exports = { encode, decode, getCommands };
