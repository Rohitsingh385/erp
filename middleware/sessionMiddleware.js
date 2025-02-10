const session = require('express-session');
const flash = require('connect-flash');
const passport = require('../config/passport');

module.exports = (app) => {
    app.use(session({
        secret: 'R0hit+$ingh',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // Set to true if using HTTPS
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    // Global variables for flash messages
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
    });
};
