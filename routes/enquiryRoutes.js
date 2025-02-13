const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { ensureAuthenticated, ensureRoot } = require('../middleware/authMiddleware');

// Parent fills enquiry form (Publicly accessible)
router.get('/form', enquiryController.renderEnquiryForm);
router.post('/submit', enquiryController.submitEnquiry);

// Root user views all enquiries
router.get('/dashboard', ensureAuthenticated, ensureRoot, enquiryController.viewAllEnquiries);

// Update enquiry status
router.post('/update-status/:id', ensureAuthenticated, ensureRoot, enquiryController.updateEnquiryStatus);

// View a single enquiry
router.get('/view/:id', ensureAuthenticated, ensureRoot, enquiryController.viewEnquiry);

// Search enquiries
router.get('/search', ensureAuthenticated, ensureRoot, enquiryController.searchEnquiries);

// Delete an enquiry
router.get('/delete/:id', ensureAuthenticated, ensureRoot, enquiryController.deleteEnquiry);

// Send an email to the parent
router.post('/send-email/:id', ensureAuthenticated, ensureRoot, enquiryController.sendEmailToParent);

// Download Enquiries as Excel
router.get('/download/excel', ensureAuthenticated, ensureRoot, enquiryController.downloadEnquiriesExcel);

// Download Enquiries as PDF
router.get('/download/pdf', ensureAuthenticated, ensureRoot, enquiryController.downloadEnquiriesPDF);

module.exports = router;
