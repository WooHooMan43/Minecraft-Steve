const {
	Client,
	CommandInteraction,
	InteractionReplyOptions,
	MessageEmbed,
	ApplicationCommandData,
	Permissions,
} = require("discord.js");

module.exports = {
	// /** @type {ApplicationCommandData}*/
	data: {
		name: "clear",
		description: "Delete messages from the current channel",
		default_member_permissions: String(Permissions.FLAGS.MANAGE_MESSAGES),
		options: [
			{
				name: "number",
				description: "The number of messages to delete",
				type: "INTEGER",
				min_value: 1,
				required: true,
			},
		],
	},
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {{ number: number }} options
	 * @returns {Promise<InteractionReplyOptions>}
	 */
	async execute(client, interaction, options) {
		const embed = new MessageEmbed();

		if (interaction.channel && interaction.channel.type != "DM") {
			interaction.channel.bulkDelete(options.number);
			embed
				.setTitle(`Deleted ${options.number} messages.`)
				.addField(
					'"I just cleaned up this mess! Can we keep it clean for 10 minutes?"',
					"- Mr. Incredible"
				);
		}

		return { embeds: [embed], ephemeral: true };
	},
};
