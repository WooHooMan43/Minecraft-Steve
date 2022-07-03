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
		name: "bank",
		description: "View bank information.",
		defaultPermission: true,
		default_member_permissions: String(Permissions.DEFAULT),
		options: [
			{
				name: "view",
				description: "View your current balance",
				type: "SUB_COMMAND",
			},
			// {
			// 	name: "deposit",
			// 	description: "Deposit money into your account.",
			// 	type: "SUB_COMMAND",
			// 	options: [
			// 		{
			// 			name: "amount",
			// 			description: "Deposit amount",
			// 			type: "NUMBER",
			// 			required: true,
			// 		},
			// 	],
			// },
			// {
			// 	name: "withdraw",
			// 	description: "Withdraw money from your account.",
			// 	type: "SUB_COMMAND",
			// 	options: [
			// 		{
			// 			name: "amount",
			// 			description: "Deposit amount",
			// 			type: "NUMBER",
			// 			required: true,
			// 		},
			// 	],
			// },
			{
				name: "transfer",
				description: "Transfer money to someone's account.",
				type: "SUB_COMMAND",
				options: [
					{
						name: "amount",
						description: "Transfer amount",
						type: "NUMBER",
						min_value: 0,
						required: true,
					},
					{
						name: "user",
						description: "User to transfer to.",
						type: "USER",
						required: true,
					},
				],
			},
		],
	},
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {{ view: {}; transfer:? { amount: number; user: string }}} options
	 * @returns {Promise<InteractionReplyOptions>}
	 */
	async execute(client, interaction, options) {
		if (!interaction.member) return {};

		// @ts-ignore
		const guildDB = levelup(leveldown("./guilds"));
		// @ts-ignore
		const userDB = levelup(leveldown("./users"));

		var guildData = { currency: { name: "Diamonds", symbol: "💎 " } };
		guildDB.get(interaction.guildId).then((value) => {
			guildData = decode(value);
			guildDB.close();
		});

		const embed = new MessageEmbed()
			.setTitle(guildData.currency.name)
			.setColor("YELLOW");

		await userDB
			.get(`${interaction.guildId}-${interaction.member.user.id}`)
			.then(async (value) => {
				if (options.view) {
					let val = decode(value);
					embed.setDescription(`${guildData.currency.symbol}${val.bank}`);
				} else if (options.transfer) {
					const amount = options.transfer.amount;
					let senderData = decode(value);
					await userDB
						.get(`${interaction.guildId}-${options.transfer.user}`)
						.then(async (receiver) => {
							let receiverData = decode(receiver);
							senderData.bank -= amount;
							receiverData.bank += amount;
							// I SHOULDNT NEED THIS CHECK ITS ALREADY DONE
							if (interaction.member && options.transfer) {
								await userDB.put(
									`${interaction.guildId}-${interaction.member.user.id}`,
									encode(senderData)
								);
								await userDB.put(
									`${interaction.guildId}-${options.transfer.user}`,
									encode(receiverData)
								);
								embed
									.setDescription(
										`Transfered ${guildData.currency.symbol}${amount}.`
									)
									.addField(
										`${guildData.currency.symbol}${senderData.bank}`,
										`-${guildData.currency.symbol}${amount}`
									);
							}
						})
						.catch((err) => {
							if (err && err.type == "NotFoundError") {
								embed
									.setDescription("User not found.")
									.addField(
										`${guildData.currency.symbol}${senderData.bank}`,
										""
									);
							}
						});
				}
			})
			.catch((error) => {
				if (error && error.type == "NotFoundError") {
					embed.setDescription("An error occured.");
				}
			})
			.finally(() => userDB.close());

		return { embeds: [embed], ephemeral: true };
	},
};
