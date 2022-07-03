const {
	Client,
	Interaction,
	InteractionReplyOptions,
	CommandInteractionOption,
} = require("discord.js");
const { getCommands } = require("../../utils");

/**
 * @param {readonly CommandInteractionOption[]} options
 * @returns
 */
const formatOptions = (options) => {
	let args = {};
	for (const option of options) {
		const { name, value, options } = option;
		if (options) {
			args[name] = formatOptions(options);
		} else args[name] = value;
	}
	return args;
};

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) return;
	if (!client.user) return;

	// Show that the bot is 'Listening to USER'
	client.user.setPresence({
		status: "online",
		activities: [
			{
				name: interaction.user.tag,
				type: 2,
			},
		],
	});

	const cmdname = interaction.commandName;

	const cmdoptions = interaction.options.data;

	var command = getCommands().get(cmdname);

	var options = cmdoptions ? formatOptions(cmdoptions) : {};

	if (command) {
		command.execute(client, interaction, options).then(
			/** @param {InteractionReplyOptions} response */
			(response) => {
				setTimeout(() => {
					if (interaction.deferred) interaction.editReply(response);
					else interaction.reply(response);
				}, 500);

				// Show that the bot is 'Playing Minecraft'
				setTimeout(() => {
					if (client.user)
						client.user.setPresence({
							status: "online",
							activities: [
								{
									name: "Minecraft",
									type: 0,
								},
							],
						});
				}, 5000);
			}
		);
	}
};
