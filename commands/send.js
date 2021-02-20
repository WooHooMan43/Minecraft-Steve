// Require modules
const profileModel = require('../models/profileSchema');

module.exports = {
	name: 'send',
	description: "Sends a member some points.",
	viewable: true,
	admin: false,
	subcommands: '[@User] [Points]',
	async execute(client, message, args, Discord, replyEmbed, data){
		let recievedMember = message.mentions.members.first();
		let profileData = data[1]
		let recieverData;
		try {
			recieverData = await profileModel.findOne({ userID: recievedMember.user.id });
			if (!recieverData) {
				let profile = await profileModel.create({
					userID: recievedMember.user.id,
					serverID: message.guild.id
				});
				profile.save();
			}
		} catch (err) {
			console.error(err);
		};
		if (!isNaN(args[1]) && parseInt(args[1]) >= 0 && parseInt(args[1]) <= profileData.coins && !recievedMember.user.bot) { // Send points if its a number
			var pointsSent = parseInt(args[1]);
			const responseSender = await profileModel.findOneAndUpdate({ userID: message.author.id, serverID: message.guild.id }, { $inc: { coins : pointsSent * -1 } })
			const responseReciever = await profileModel.findOneAndUpdate({ userID: recievedMember.user.id, serverID: message.guild.id }, { $inc: { coins : pointsSent } })
			message.reply(replyEmbed.setColor(0xFFC300).setTitle('Points').setDescription(`Sent ${args[1]} points to ${recievedMember.user.tag}.`));
			return 'Good';
		} else return 'Unknown';
	}
}
