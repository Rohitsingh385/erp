const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    className: { type: String, required: true },
    teacher: { type: String, required: false },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);