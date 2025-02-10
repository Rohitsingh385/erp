const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureRoot } = require('../middleware/authMiddleware');

// Root Dashboard
router.get('/dashboard', ensureAuthenticated, ensureRoot, (req, res) => {
    res.render('root/dashboard', { user: req.user });
});

module.exports = router;
