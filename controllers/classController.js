const Class = require('../models/Class');
const User = require('../models/User');



exports.getAddClassForm = (req, res) => {
    res.render('class/addClass'); // Ensure 'views/class/addClass.ejs' exists
};

exports.getClassDashboard = async (req, res) => {
    try {
        const classes = await Class.find();
        res.render('class/classDashboard', { classes }); 
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate('assignedTeachers', 'name email');
        res.json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addClass = async (req, res) => {
    try {
        const { className, section } = req.body; // Removed assignedTeachers for now

        const newClass = new Class({ 
            className, 
            section, 
            assignedTeachers: [],  // Default to an empty array
        });

        await newClass.save();
        res.redirect('/class/dashboard'); // Redirect after successful addition

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// Update class
exports.updateClass = async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClass) return res.status(404).json({ message: 'Class not found' });

        res.json({ message: 'Class updated successfully', updatedClass });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete class
exports.deleteClass = async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);
        if (!deletedClass) return res.status(404).json({ message: 'Class not found' });

        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }

    exports.getEditClassForm = async (req, res) => {
        try {
            const classData = await Class.findById(req.params.id);
            if (!classData) return res.status(404).json({ message: 'Class not found' });
    
            res.render('class/editClass', { classData }); // Ensure this file exists in views/class/
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };
    
};
