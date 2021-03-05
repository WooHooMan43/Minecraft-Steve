const profileModel = require('../../models/profileSchema');

module.exports = async (client, Discord, member) => {
	let profile = await profileModel.findOneAndRemove({ userID: member.id, serverID: member.guild.id });
	
	profile.save();
}