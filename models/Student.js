const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    admissionNumber: { type: String, unique: true, required: true },
    studentName: { type: String, required: true },
    fatherName: { type: String, required: true },
    parentContact: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    classSection: { type: String, required: true }, // Will be linked to Class Module
    busDetails: { type: String }, // Will be linked to Bus Module
    documents: [{ type: String }], 
    studentImage: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model("Student", StudentSchema);
