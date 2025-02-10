const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['root', 'admin', 'teacher', 'parent'], default: 'admin' },
    modulesAccess: [{ type: String }], // Modules the user has access to
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
