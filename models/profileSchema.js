const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
	userID: { type: String, require: true },
	serverID: { type: String, require: true },
	coins: { type: Number, default: 0 },
	bank: { type: Number, default: 0 },
	cooldowns: { type: Array, default: [] },
	inventory: { type: Array, default: [] }
});

const model = mongoose.model('ProfileModels', profileSchema);

module.exports = model;