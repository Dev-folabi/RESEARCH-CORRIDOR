const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { addMessage } = require('./controllers/chatController');
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
app.use('/api/season', require('./routes/seasonRoute'));
app.use('/api/department', require('./routes/departmentRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/researcher', require('./routes/researcherRoute'));
app.use('/api/notification', require('./routes/notificationRoute') )
app.use('/api/supervisor', require('./routes/supervisorRoutes'))
app.use('/api/chat', require('./routes/chatRoutes'))

// Socket.IO connection
io.on('connection', (socket)=>{
    console.log('someone connected')

    // Join Room
    socket.on('joinRoom', ({ supervisorId, season })=>{
        const room = `${supervisorId}-${season}`
        socket.join(room)
        console.log(`User joined room: ${room}`);
    })

    // Handle chat messages
    socket.on('chatMessage', async({supervisorId, season, senderId, message}) =>{
        const room = `${supervisorId}-${season}`
        io.to(room).emit('message', {senderId, message})

        // Save message to database
        await addMessage( supervisorId, season, senderId, message );
    })

    socket.on('disconnect', () => { console.log('User disconnected')})
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
