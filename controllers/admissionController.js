const Student = require("../models/Student");

//  Display Student Dashboard
exports.getAdmissionDashboard = async (req, res) => {
    try {
        const students = await Student.find();
        res.render("admission/dashboard", { students });
    } catch (error) {
        res.status(500).send("Error fetching student records");
    }
};

//  Search Students
exports.searchStudents = async (req, res) => {
    try {
        const { query } = req.query;
        const students = await Student.find({
            $or: [
                { studentName: { $regex: query, $options: "i" } },
                { admissionNumber: { $regex: query, $options: "i" } },
                { fatherName: { $regex: query, $options: "i" } }
            ]
        });
        res.render("admission/dashboard", { students });
    } catch (error) {
        res.status(500).send("Error searching student records");
    }
};

//  Show Admission Form
exports.showAdmissionForm = (req, res) => {
    res.render("admission/addStudent");
};

//  Handle New Admission
exports.addStudent = async (req, res) => {
    try {
        const { studentName, fatherName, parentContact, email, age, classSection, busDetails } = req.body;

        // Generate admission number (Example: AD2024001)
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
};
