const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

router.get('/attendance', ensureAuthenticated, async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find();
        res.json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add attendance record
router.post('/attendance', ensureAuthenticated, async (req, res) => {
    try {
        const newAttendance = new Attendance(req.body);
        await newAttendance.save();
        res.json({ message: 'Attendance recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update attendance record
router.put('/attendance/:id', ensureAuthenticated, async (req, res) => {
    try {
        const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAttendance) return res.status(404).json({ message: 'Attendance record not found' });
        res.json({ message: 'Attendance updated successfully', updatedAttendance });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete attendance record
router.delete('/attendance/:id', ensureAuthenticated, async (req, res) => {
    try {
        const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);
        if (!deletedAttendance) return res.status(404).json({ message: 'Attendance record not found' });
        res.json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;