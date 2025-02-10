const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Bus = require('../models/Bus');
const Class = require('../models/Class');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

router.get('/classes', ensureAuthenticated, async (req, res) => {
    try {
        const classes = await Class.find();
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add class record
router.post('/classes', ensureAuthenticated, async (req, res) => {
    try {
        const newClass = new Class(req.body);
        await newClass.save();
        res.json({ message: 'Class record added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update class record
router.put('/classes/:id', ensureAuthenticated, async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClass) return res.status(404).json({ message: 'Class record not found' });
        res.json({ message: 'Class record updated successfully', updatedClass });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete class record
router.delete('/classes/:id', ensureAuthenticated, async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);
        if (!deletedClass) return res.status(404).json({ message: 'Class record not found' });
        res.json({ message: 'Class record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
