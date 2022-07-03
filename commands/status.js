const {
	Client,
	CommandInteraction,
	InteractionReplyOptions,
	MessageEmbed,
	MessageAttachment,
	ApplicationCommandData,
	Permissions,
} = require("discord.js");
const ServerUtils = require("minecraft-server-util");
const levelup = require("levelup");
const leveldown = require("leveldown");
const { decode } = require("../utils");

module.exports = {
	// /** @type {ApplicationCommandData}*/
	data: {
		name: "status",
		description: "Displays information about a set Minecraft server.",
		default_member_permissions: String(Permissions.DEFAULT),
		options: [
			{
				name: "address",
				description: "The address to grab information from",
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
		if (!interaction.guild) return {};

		interaction.deferReply({ ephemeral: true });

		var files = [];

		const embed = new MessageEmbed();
		// @ts-ignore Get the info from the server
		const db = levelup(leveldown("./guilds"));
		await db
			.get(interaction.guild.id)
			.then(async (value) => {
				const address = options.address
					? options.address
					: decode(value).address;
				await ServerUtils.status(address)
					.then((response) => {
						embed
							.setTitle(address)
							.setColor("GREEN")
							.setDescription(response.motd.clean.trim())
							.addField("Version", response.version.name, true)
							.addField(
								"Players",
								`${response.players.online}/${response.players.max}`,
								true
							);
						// Format the icon and send it
						if (response.favicon) {
							const image = Buffer.from(
								response.favicon.replace("data:image/png;base64,", ""),
								"base64"
							);
							const attachment = new MessageAttachment(image, "icon.png");
							files.push(attachment);
							embed.setThumbnail("attachment://icon.png");
						}
					})
					.catch((error) => {
						// If server doesn't respond, assume its down and its not my fault
						embed
							.setTitle(address)
							.setDescription(
								"Sorry, but I can't find any information on this server. It might be offline."
							)
							.setColor("RED");
					});
			})
			.catch((error) => {
				embed
					.setTitle("Server Status")
					.setDescription("An error occurred.")
					.setColor("RED");
			})
			.finally(() => db.close());

		return { embeds: [embed], files: files, ephemeral: true };
	},
};
