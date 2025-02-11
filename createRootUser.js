const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust the path if needed
const db = require('./config/db'); // Import your existing DB connection

async function createRootUser() {
    try {
        await db(); // Ensure DB connection is established

        const existingRootUser = await User.findOne({ role: 'root' });
        if (existingRootUser) {
            console.log('Root user already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash('root@123', 10); // Change the password as needed

        const rootUser = new User({
            username: 'root',
            password: hashedPassword,
            role: 'root'
        });

        await rootUser.save();
        console.log('Root user created successfully.');
    } catch (error) {
        console.error('Error creating root user:', error);
    } finally {
        mongoose.connection.close();
    }
}

createRootUser();
