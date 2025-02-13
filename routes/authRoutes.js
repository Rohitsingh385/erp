const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureRoot, ensureAdmin } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

//  Routes with Controller Functions
router.get("/login", authController.renderLogin);
router.get("/register", authController.renderRegister);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/register", authController.register);
router.post("/create-user", ensureRoot, authController.createUser);
router.post("/create-teacher", ensureAdmin, authController.createTeacher);

module.exports = router;
