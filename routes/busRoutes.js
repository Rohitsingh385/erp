const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Bus = require('../models/Bus');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

router.get('/buses', ensureAuthenticated, async (req, res) => {
    try {
        const buses = await Bus.find();
        res.json(buses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add bus record
router.post('/buses', ensureAuthenticated, async (req, res) => {
    try {
        const newBus = new Bus(req.body);
        await newBus.save();
        res.json({ message: 'Bus record added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update bus record
router.put('/buses/:id', ensureAuthenticated, async (req, res) => {
    try {
        const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBus) return res.status(404).json({ message: 'Bus record not found' });
        res.json({ message: 'Bus record updated successfully', updatedBus });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete bus record
router.delete('/buses/:id', ensureAuthenticated, async (req, res) => {
    try {
        const deletedBus = await Bus.findByIdAndDelete(req.params.id);
        if (!deletedBus) return res.status(404).json({ message: 'Bus record not found' });
        res.json({ message: 'Bus record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;