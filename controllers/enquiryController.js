const Enquiry = require('../models/Enquiry');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Render enquiry form
exports.renderEnquiryForm = (req, res) => {
    res.render('enquiryForm', { query: req.query });
};

// Submit an enquiry
exports.submitEnquiry = async (req, res) => {
    try {
        const { parentName, studentName, previousSchool, contactNumber, email, message } = req.body;

        if (!parentName || !contactNumber || !email || !studentName) {
            return res.status(400).send('Missing required fields');
        }

        const newEnquiry = new Enquiry({ parentName, studentName, previousSchool, contactNumber, email, message });
        await newEnquiry.save();

        res.redirect('/enquiry/form?success=1');
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        res.status(500).send('Error submitting enquiry');
    }
};

// View all enquiries
exports.viewAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find();
        res.render('enquiry/dashboard', { enquiries });
    } catch (error) {
        res.status(500).send('Error loading enquiries');
    }
};

// Update enquiry status
exports.updateEnquiryStatus = async (req, res) => {
    try {
        await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.redirect('/enquiry/dashboard');
    } catch (error) {
        res.status(500).send('Error updating status');
    }
};

// View a single enquiry
exports.viewEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        res.render('enquiry/view', { enquiry });
    } catch (error) {
        res.status(500).send('Error loading enquiry details');
    }
};

// Search enquiries
exports.searchEnquiries = async (req, res) => {
    try {
        const { query } = req.query;
        const enquiries = await Enquiry.find({
            $or: [
                { parentName: { $regex: query, $options: 'i' } },
                { studentName: { $regex: query, $options: 'i' } },
                { contactNumber: { $regex: query, $options: 'i' } }
            ]
        });
        res.render('enquiry/dashboard', { enquiries });
    } catch (error) {
        res.status(500).send('Error searching enquiries');
    }
};

// Delete an enquiry
exports.deleteEnquiry = async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        res.redirect('/enquiry/dashboard');
    } catch (error) {
        res.status(500).send('Error deleting enquiry');
    }
};

// Send an email to the parent
exports.sendEmailToParent = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        const { emailMessage } = req.body;

        // Setup nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com', // Replace with your email
                pass: 'your-email-password' // Use an app password for security
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
};

// Download Enquiries as Excel
exports.downloadEnquiriesExcel = async (req, res) => {
    try {
        const enquiries = await Enquiry.find();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Enquiries');

        worksheet.columns = [
            { header: 'Parent Name', key: 'parentName', width: 20 },
            { header: 'Student Name', key: 'studentName', width: 20 },
            { header: 'Previous School', key: 'previousSchool', width: 25 },
            { header: 'Contact', key: 'contactNumber', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Message', key: 'message', width: 30 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 }
        ];

        enquiries.forEach(enquiry => worksheet.addRow(enquiry));

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=enquiries.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).send('Error generating Excel file');
    }
};

// Download Enquiries as PDF
exports.downloadEnquiriesPDF = async (req, res) => {
    try {
        const enquiries = await Enquiry.find();

        const doc = new PDFDocument();
        res.setHeader('Content-Disposition', 'attachment; filename=enquiries.pdf');
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(18).text('Enquiry List', { align: 'center' });
        doc.moveDown();

        enquiries.forEach((enquiry, index) => {
            doc.fontSize(12).text(
                `${index + 1}. Parent: ${enquiry.parentName} | Student: ${enquiry.studentName} | Contact: ${enquiry.contactNumber} | Status: ${enquiry.status}`
            );
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF file');
    }
};
