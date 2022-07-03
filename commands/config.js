const {
	Client,
	InteractionReplyOptions,
	MessageEmbed,
	CommandInteraction,
	ApplicationCommandData,
	Permissions,
} = require("discord.js");
const levelup = require("levelup");
const leveldown = require("leveldown");
const { encode, decode } = require("../utils");

module.exports = {
	// /** @type {ApplicationCommandData} */
	data: {
		name: "config",
		description: "View/change bot configuration",
		default_member_permissions: String(Permissions.FLAGS.MANAGE_GUILD),
		options: [
			{
				name: "address",
				description: "The default address for server status checks",
				type: "STRING",
				required: false,
			},
		],
	},
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {{ address?: string; }} options
	 * @returns {Promise<InteractionReplyOptions>}
	 */
	async execute(client, interaction, options) {
		const embed = new MessageEmbed().setTitle("Configuration");

		// @ts-ignore
		const db = levelup(leveldown("./guilds"));

		await db
			.get(interaction.guildId)
			.then(async (value) => {
				const guildData = decode(value);
				if (options.address) {
					guildData.address = options.address;
				}
				if (Object.keys(options).length > 0)
					embed.setDescription("Configuration updated");

				embed.addField("Server Address", guildData.address, true);

				await db.put(interaction.guildId, encode(guildData));
			})
			.catch((error) => {
				embed.setDescription("An error occured");
			})
			.finally(() => db.close());

		return { embeds: [embed], ephemeral: true };
	},
};
