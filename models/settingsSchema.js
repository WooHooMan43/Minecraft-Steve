const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    serverID: { type: String, require: true, unique: true },
    ServerAddress: { type: String, require: true, default: 'play.woohoocraft.net' },
    PointsIncrement: { type: Number, require: true, default: 5 },
    Prefix: { type: String, require: true, default: '!' },
    AdminRoles: { type: Array, require: true, default: [] },
    UserExceptions: { type: Array, require: true, default: [] },
    BannedWords: { type: Array, require: true, default: [] },
    MutedMembers: { type: Array, require: true, default: [] }
});

const model = mongoose.model('SettingsModels', settingsSchema);

module.exports = model;