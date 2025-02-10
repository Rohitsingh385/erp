const BusSchema = new mongoose.Schema({
    routeNumber: { type: String, required: true },
    driverName: { type: String, required: true },
    capacity: { type: Number, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

module.exports = mongoose.model('Bus', BusSchema);