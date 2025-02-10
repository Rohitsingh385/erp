module.exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
};

module.exports.ensureRoot = (req, res, next) => {
    if (req.user && req.user.role === 'root') {
        return next();
    }
    res.status(403).send('Access Denied');
};

module.exports.ensureAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access Denied');
};

module.exports.ensureTeacher = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        return next();
    }
    res.status(403).send('Access Denied');
};

module.exports.ensureParent = (req, res, next) => {
    if (req.user && req.user.role === 'parent') {
        return next();
    }
    res.status(403).send('Access Denied');
};
