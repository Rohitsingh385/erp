const AttendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);