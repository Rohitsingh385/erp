const ActivityLog = require('../models/ActivityLog');

// Ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
};

// Ensure user is Root
const ensureRoot = (req, res, next) => {
    if (req.user && req.user.role === 'root') {
        return next();
    }
    res.status(403).send('Access Denied');
};

// Ensure user is Admin
const ensureAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access Denied');
};

// Ensure user is Teacher
const ensureTeacher = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        return next();
    }
    res.status(403).send('Access Denied');
};

// Ensure user is Parent
const ensureParent = (req, res, next) => {
    if (req.user && req.user.role === 'parent') {
        return next();
    }
    res.status(403).send('Access Denied');
};

// Log user activity
const logActivity = (user, action) => {
    if (!user) return;
    const log = new ActivityLog({ user: user._id, action });
    log.save();
};


module.exports = {
    ensureAuthenticated,
    ensureRoot,
    ensureAdmin,
    ensureTeacher,
    ensureParent,
    logActivity
};
