const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Added bcrypt
const User = require('../models/User'); // Added User model
const { ensureAuthenticated, ensureRoot } = require('../middleware/authMiddleware'); // Ensure correct function names

// Root Dashboard
router.get('/dashboard', ensureAuthenticated, ensureRoot, (req, res) => {
    res.render('root/dashboard', { user: req.user });
});

// Show all users
router.get('/users', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'root' } }); // Exclude root user
        res.render('root/users', { users });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Create new user
router.post('/users/create', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.redirect('/root/users');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Delete user
router.get('/users/delete/:id', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/root/users');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
