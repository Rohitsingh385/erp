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

router.get('/users/edit/:id', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.render('root/editUser', { user });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Edit User - Update in DB
router.post('/users/edit/:id', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const { username, role, password } = req.body;
        let updateData = { username, role };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        await User.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/root/users');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Search Users
router.get('/users/search', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const query = req.query.query;
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { role: { $regex: query, $options: 'i' } }
            ]
        });
        res.render('root/users', { users });
    } catch (error) {
        res.status(500).send('Server error');
    }
});


router.get('/users/activity/:id', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const logs = await ActivityLog.find({ user: req.params.id }).sort({ timestamp: -1 });
        res.render('root/activityLogs', { logs });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.post('/users/reset-password/:id', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
        res.redirect('/root/users');
    } catch (error) {
        res.status(500).send('Server error');
    }
});



module.exports = router;
