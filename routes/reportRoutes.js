const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Class = require('../models/Class');
const Report = require('../models/Report');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');


router.get('/reports', ensureAuthenticated, async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add report
router.post('/reports', ensureAuthenticated, async (req, res) => {
    try {
        const newReport = new Report(req.body);
        await newReport.save();
        res.json({ message: 'Report added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update report
router.put('/reports/:id', ensureAuthenticated, async (req, res) => {
    try {
        const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReport) return res.status(404).json({ message: 'Report not found' });
        res.json({ message: 'Report updated successfully', updatedReport });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete report
router.delete('/reports/:id', ensureAuthenticated, async (req, res) => {
    try {
        const deletedReport = await Report.findByIdAndDelete(req.params.id);
        if (!deletedReport) return res.status(404).json({ message: 'Report not found' });
        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
