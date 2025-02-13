const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

//  Render login page
exports.renderLogin = (req, res) => {
    res.render("auth/login", { message: req.flash("error") });
};

//  Render register page
exports.renderRegister = (req, res) => {
    res.render("auth/register", { message: req.flash("error") });
};

//  Handle Login
exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message });

        req.logIn(user, (err) => {
            if (err) return next(err);
            if (user.role === "root") {
                return res.redirect("/root/dashboard");
            } else if (user.role === "admin") {
                return res.redirect("/admin/dashboard");
            } else if (user.role === "teacher") {
                return res.redirect("/teacher/dashboard");
            } else {
                return res.redirect("/parent/dashboard");
            }
        });
    })(req, res, next);
};

//  Handle Logout
exports.logout = (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.json({ message: "Logout successful" });
    });
};

//  Handle User Registration
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username });

        if (user) {
            req.flash("error_msg", "User already exists");
            return res.redirect("/register");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, password: hashedPassword, role: "parent" });
        await user.save();

        req.flash("success_msg", "User registered successfully, you can now log in");
        res.redirect("/login");
    } catch (error) {
        req.flash("error_msg", "Server error");
        res.redirect("/register");
    }
};

//  Create Admins & Teachers (Root only)
exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (role !== "admin" && role !== "teacher") {
            return res.status(403).json({ message: "Only root can create admins & teachers" });
        }

        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, password: hashedPassword, role });

        await user.save();
        res.json({ message: `${role} created successfully` });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//  Create Teacher (Admin only)
exports.createTeacher = async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, password: hashedPassword, role: "teacher" });

        await user.save();
        res.json({ message: "Teacher created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
