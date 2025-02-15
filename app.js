const express = require('express');
const db = require('./config/db');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const sessionMiddleware = require('./middleware/sessionMiddleware');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply session & authentication middleware
sessionMiddleware(app);

// Routes
const rootRoutes = require('./routes/rootRoutes');
app.use('/root', rootRoutes);
app.use('/auth', authRoutes);
const enquiryRoutes = require('./routes/enquiryRoutes');
app.use('/enquiry', enquiryRoutes);
const admissionRoutes = require('./routes/admissionRoutes');  
app.use('/admission', admissionRoutes); 
const classRoutes = require('./routes/classRoutes');
app.use('/class', classRoutes);




// Home Route
app.get('/', (req, res) => {
    res.send('ERP System Home Page');
});

// Connect to database
db(); 

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
