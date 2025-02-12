const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    parentName: { type: String, required: true },
    studentName: { type: String, required: true },
    previousSchool: { type: String },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String },
    status: { 
        type: String, 
        enum: ['Pending', 'Interested', 'Not Interested'], 
        default: 'Pending' 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema);
