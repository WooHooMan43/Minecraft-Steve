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
		name: "currency",
		description: "Change currency configuration",
		default_member_permissions: String(Permissions.FLAGS.MANAGE_GUILD),
		options: [
			{
				name: "name",
				description: "The name of the currency",
				type: "STRING",
				required: false,
			},
			{
				name: "symbol",
				description: "The symbol of the currency",
				type: "STRING",
				required: false,
			},
			{
				name: "increment",
				description: "The amount of currency to add for each message",
				type: "NUMBER",
				min_value: 0,
				required: false,
			},
		],
	},
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {{ name?: string; symbol?: string; increment?: number }} options
	 * @returns {Promise<InteractionReplyOptions>}
	 */
	async execute(client, interaction, options) {
		const embed = new MessageEmbed().setTitle("Currency");

		// @ts-ignore
		const db = levelup(leveldown("./guilds"));

		await db
			.get(interaction.guildId)
			.then(async (value) => {
				const guildData = decode(value);
				if (options.name) {
					guildData.currency.name = options.name;
				} else if (options.symbol) {
					guildData.currency.symbol = options.symbol;
				} else if (options.increment) {
					guildData.currency.increment = options.increment;
				}
				if (Object.keys(options).length > 0)
					embed.setDescription("Currency updated");

				let sign = Math.sign(guildData.currency.increment).toString();
				let inc_str = `${guildData.currency.symbol}${guildData.currency.increment}`;
				if (sign.length == 2) inc_str = "-" + inc_str;
				embed
					.addField("Name", guildData.currency.name, true)
					.addField("Symbol", guildData.currency.symbol, true)
					.addField("Increment", inc_str, true);

				await db.put(interaction.guildId, encode(guildData));
			})
			.catch((error) => {
				embed.setDescription("An error occured");
			})
			.finally(() => db.close());

		return { embeds: [embed], ephemeral: true };
	},
};
