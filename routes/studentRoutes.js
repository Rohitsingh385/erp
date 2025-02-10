const express = require('express');
const router = express.Router();
const User = require('../models/Student');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
router.get('/students', ensureAuthenticated, async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new student
router.post('/students', ensureAuthenticated, async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.json({ message: 'Student added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update student details
router.put('/students/:id', ensureAuthenticated, async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student updated successfully', updatedStudent });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a student
router.delete('/students/:id', ensureAuthenticated, async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
