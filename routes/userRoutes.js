const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Get all users
router.get('/users', ensureAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new user
router.post('/users', ensureAdmin, async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const newUser = new User({ username, password, role });
        await newUser.save();
        res.json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user details
router.put('/users/:id', ensureAdmin, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a user
router.delete('/users/:id', ensureAdmin, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
