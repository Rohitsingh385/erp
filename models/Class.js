const ClassSchema = new mongoose.Schema({
    className: { type: String, required: true },
    teacher: { type: String, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);