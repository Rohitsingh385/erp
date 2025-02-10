const FeeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Fee', FeeSchema);