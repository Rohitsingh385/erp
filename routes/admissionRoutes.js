const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureRoot } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const admissionController = require("../controllers/admissionController");

// File Upload Configuration
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

//  Routes with Controller Functions
router.get("/dashboard", ensureAuthenticated, ensureRoot, admissionController.getAdmissionDashboard);
router.get("/search", ensureAuthenticated, ensureRoot, admissionController.searchStudents);
router.get("/add", ensureAuthenticated, ensureRoot, admissionController.showAdmissionForm);
router.post("/add", ensureAuthenticated, ensureRoot, upload.fields([{ name: "studentImage" }, { name: "documents" }]), admissionController.addStudent);

module.exports = router;
