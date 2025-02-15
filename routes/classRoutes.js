const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureRoot } = require('../middleware/authMiddleware');
const classController = require('../controllers/classController'); 

// Route to display Class Dashboard
router.get('/dashboard', ensureAuthenticated, classController.getClassDashboard);

// Route to show the Add Class form
router.get('/add', ensureAuthenticated, classController.getAddClassForm);

router.get('/edit/:id', classController.getEditClass);


// Route to handle form submission for adding a new class (POST)
router.post('/add', ensureAuthenticated, ensureRoot, classController.addClass);

// Get all classes
router.get('/classes', ensureAuthenticated, classController.getAllClasses);

// Update a class (Admin Only)
router.put('/classes/:id', ensureAuthenticated, ensureRoot, classController.updateClass);

router.get('/edit/:id', classController.getEditClassForm); 


// Delete a class (Admin Only)
router.delete('/classes/:id', ensureAuthenticated, ensureRoot, classController.deleteClass);

module.exports = router;
