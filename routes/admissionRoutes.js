const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const multer = require("multer");
const path = require("path");
const { ensureAuthenticated, ensureRoot } = require("../middleware/authMiddleware");

// File Upload Configuration
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

//  Display Student Dashboard (Admin Only)
router.get("/dashboard", ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const students = await Student.find();
        res.render("admission/dashboard", { students });
    } catch (error) {
        res.status(500).send("Error fetching student records");
    }
});

// Search Students
router.get("/search", ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const { query } = req.query;
        const students = await Student.find({
            $or: [
                { studentName: { $regex: query, $options: "i" } },
                { admissionNumber: { $regex: query, $options: "i" } },
                { fatherName: { $regex: query, $options: "i" } },
            ]
        });
        res.render("admission/dashboard", { students });
    } catch (error) {
        res.status(500).send("Error searching student records");
    }
});

//  Show Admission Form
router.get("/add", ensureAuthenticated, ensureRoot, (req, res) => {
    res.render("admission/addStudent");
});

//  Handle New Admission (with File Upload)
router.post("/add", ensureAuthenticated, ensureRoot, upload.fields([{ name: "studentImage" }, { name: "documents" }]), async (req, res) => {
    try {
        const { studentName, fatherName, parentContact, classSection, busDetails, email, age } = req.body;

        // Auto-generate Admission Number (Example: AD2024001)
        const lastStudent = await Student.findOne().sort({ createdAt: -1 });
        let newAdmissionNumber = "AD2024001";

        if (lastStudent && lastStudent.admissionNumber) {
            const lastNumber = parseInt(lastStudent.admissionNumber.replace("AD", ""), 10) + 1;
            newAdmissionNumber = `AD${lastNumber}`;
        }

        const studentImage = req.files["studentImage"] ? req.files["studentImage"][0].filename : null;
        const documents = req.files["documents"] ? req.files["documents"].map(file => file.filename) : [];

        const newStudent = new Student({
            admissionNumber: newAdmissionNumber,
            studentName,
            fatherName,
            parentContact,
            email,
            age,
            classSection,
            busDetails,
            documents,
            studentImage
        });

        await newStudent.save();
        res.redirect("/admission/dashboard");
    } catch (error) {
        res.status(500).send("Error processing admission");
    }
});

module.exports = router;
