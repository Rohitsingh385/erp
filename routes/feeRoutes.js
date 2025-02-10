const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');


router.get('/fees', ensureAuthenticated, async (req, res) => {
    try {
        const fees = await Fee.find();
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add fee record
router.post('/fees', ensureAuthenticated, async (req, res) => {
    try {
        const newFee = new Fee(req.body);
        await newFee.save();
        res.json({ message: 'Fee recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update fee record
router.put('/fees/:id', ensureAuthenticated, async (req, res) => {
    try {
        const updatedFee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFee) return res.status(404).json({ message: 'Fee record not found' });
        res.json({ message: 'Fee updated successfully', updatedFee });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete fee record
router.delete('/fees/:id', ensureAuthenticated, async (req, res) => {
    try {
        const deletedFee = await Fee.findByIdAndDelete(req.params.id);
        if (!deletedFee) return res.status(404).json({ message: 'Fee record not found' });
        res.json({ message: 'Fee record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
