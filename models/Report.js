const ReportSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
