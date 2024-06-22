const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

if (!process.env.JWT_PRIVATE_KEY) {
    console.error('FATAL ERROR: JWT_PRIVATE_KEY is not defined.');
    process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/validatedocuments', express.static(path.join(__dirname, 'validateDocuments')));

// Routes
app.use('/api/season', require('./routes/seasonRoute'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/researcher', require('./routes/researcherRoute'));
app.use('/api/notification', require('./routes/notificationRoute') )
app.use('/api/supervisor', require('./routes/supervisorRoutes'))

// Connect to the database and start the server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(error => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
});
