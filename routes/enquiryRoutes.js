const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const nodemailer = require('nodemailer');
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const { ensureAuthenticated, ensureRoot } = require('../middleware/authMiddleware');

//Parent fills enquiry form (Publicly accessible)

router.get("/form", (req, res) => {
    res.render("enquiryForm", { query: req.query });
});



router.post('/submit', async (req, res) => {
    try {
        //console.log("Received Data:", req.body); // Debugging

        const { parentName, studentName, previousSchool, contactNumber, email, message } = req.body;

        if (!parentName || !contactNumber || !email || !studentName) {
            return res.status(400).send('Missing required fields');
        }

        const newEnquiry = new Enquiry({ parentName, studentName, previousSchool, contactNumber, email, message });
        await newEnquiry.save();

        res.redirect('/enquiry/form?success=1');
    } catch (error) {
        console.error("Error submitting enquiry:", error);
        res.status(500).send('Error submitting enquiry');
    }
});


//  Root user views all enquiries
router.get('/dashboard', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const enquiries = await Enquiry.find();
        res.render('enquiry/dashboard', { enquiries });
    } catch (error) {
        res.status(500).send('Error loading enquiries');
    }
});

//  Update enquiry status (Pending, Interested, Not Interested)
router.post('/update-status/:id', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.redirect('/enquiry/dashboard');
    } catch (error) {
        res.status(500).send('Error updating status');
    }
});

//  View a single enquiry
router.get('/view/:id', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        res.render('enquiry/view', { enquiry });
    } catch (error) {
        res.status(500).send('Error loading enquiry details');
    }
});

//  Search enquiries by parent name, student name, or contact
router.get('/search', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const { query } = req.query;
        const enquiries = await Enquiry.find({
            $or: [
                { parentName: { $regex: query, $options: 'i' } },
                { studentName: { $regex: query, $options: 'i' } },
                { contact: { $regex: query, $options: 'i' } }
            ]
        });
        res.render('enquiry/dashboard', { enquiries });
    } catch (error) {
        res.status(500).send('Error searching enquiries');
    }
});

//  Delete an enquiry
router.get('/delete/:id', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        res.redirect('/enquiry/dashboard');
    } catch (error) {
        res.status(500).send('Error deleting enquiry');
    }
});

// Send an email to the parent
router.post('/send-email/:id', ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        const { emailMessage } = req.body;

        // Setup nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com', // Replace with your email
                pass: 'your-email-password' // Replace with your password or use an app password
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: enquiry.email,
            subject: 'Response to your Enquiry',
            text: emailMessage
        };

        await transporter.sendMail(mailOptions);
        res.redirect('/enquiry/dashboard');
    } catch (error) {
        res.status(500).send('Error sending email');
    }
});


//  Route to Download Enquiries as Excel
router.get("/download/excel", ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const enquiries = await Enquiry.find();

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Enquiries");

        // Define Columns
        worksheet.columns = [
            { header: "Parent Name", key: "parentName", width: 20 },
            { header: "Student Name", key: "studentName", width: 20 },
            { header: "Previous School", key: "previousSchool", width: 25 },
            { header: "Contact", key: "contactNumber", width: 15 },
            { header: "Email", key: "email", width: 25 },
            { header: "Message", key: "message", width: 30 },
            { header: "Status", key: "status", width: 15 },
            { header: "Created At", key: "createdAt", width: 20 }
        ];

        // Add Data
        enquiries.forEach(enquiry => {
            worksheet.addRow(enquiry);
        });

        // Set headers for download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=enquiries.xlsx");

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error generating Excel:", error);
        res.status(500).send("Error generating Excel file");
    }
});

//  Route to Download Enquiries as PDF
router.get("/download/pdf", ensureAuthenticated, ensureRoot, async (req, res) => {
    try {
        const enquiries = await Enquiry.find();

        // Create a PDF document
        const doc = new PDFDocument();
        res.setHeader("Content-Disposition", "attachment; filename=enquiries.pdf");
        res.setHeader("Content-Type", "application/pdf");

        // Pipe the document to response
        doc.pipe(res);

        // Add Title
        doc.fontSize(18).text("Enquiry List", { align: "center" });
        doc.moveDown();

        // Add Enquiry Data
        enquiries.forEach((enquiry, index) => {
            doc.fontSize(12).text(
                `${index + 1}. Parent: ${enquiry.parentName} | Student: ${enquiry.studentName} | Contact: ${enquiry.contactNumber} | Status: ${enquiry.status}`
            );
            doc.moveDown();
        });

        // End the document
        doc.end();
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("Error generating PDF file");
    }
});

module.exports = router;
