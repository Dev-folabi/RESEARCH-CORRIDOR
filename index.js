const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Create Sever and initialize Socket.IO
const server = http.createServer(app)
const io = socketIo(server)

if (!process.env.JWT_PRIVATE_KEY) {
    console.error('FATAL ERROR: JWT_PRIVATE_KEY is not defined.');
    process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/validatedocuments', express.static(path.join(__dirname, 'validateDocuments')));
app.use('/researchdocuments', express.static(path.join(__dirname, 'researchDocuments')));

// Routes
app.use('/', (req, res) => res.send('Welcome To Research Corridor API'))
app.use('/api/season', require('./routes/seasonRoute'));
app.use('/api/department', require('./routes/departmentRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/researcher', require('./routes/researcherRoute'));
app.use('/api/notification', require('./routes/notificationRoute') )
app.use('/api/supervisor', require('./routes/supervisorRoutes'))

// Socket.IO connection
io.on('connection', (socket)=>{
    console.log('someone connected')
})

// Connect to the database and start the server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(error => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
});
