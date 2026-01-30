/*
================================================================================
API.JS - PrismCare Backend Main Server File
================================================================================
This file sets up the backend server for PrismCare. It handles:
1. Express server setup and middleware
2. MongoDB database connection
3. JWT authentication middleware
4. API routes for all modules
5. Socket.IO for real-time AI chat & notifications
6. Server startup

================================================================================
*/

// -----------------------------------------------------
// 1️⃣ Load environment variables
// -----------------------------------------------------
require('dotenv').config(); // Load .env first to make env variables available

// -----------------------------------------------------
// 2️⃣ Import Modules
// -----------------------------------------------------
const express = require('express');       // Express web framework
const http = require('http');             // Node HTTP server needed for Socket.IO
const cors = require('cors');             // Handle cross-origin requests
const mongoose = require('mongoose');     // MongoDB ODM
const cookieParser = require('cookie-parser'); // Parse cookies for JWT
const jwt = require('jsonwebtoken');      // JWT authentication
const { Server } = require('socket.io');  // Socket.IO for real-time events

// -----------------------------------------------------
// 3️⃣ Database Models
// -----------------------------------------------------
const User = require('./models/User'); // User model for authentication

// -----------------------------------------------------
// 4️⃣ AI Controller
// -----------------------------------------------------
const { askAI } = require('./modules/ai/ai.controller'); // AI chat function

// -----------------------------------------------------
// 5️⃣ API Routes
// -----------------------------------------------------
const authRoutes = require('./modules/auth/auth.routes'); 
const staffRoutes = require('./modules/staff/staff.routes'); 
const clientRoutes = require('./modules/clients/client.routes'); 
const visitRoutes = require('./modules/visits/visit.routes'); 
const medicationRoutes = require('./modules/medication/medication.routes'); 
const marRoutes = require('./modules/mar/mar.routes'); 
const wellbeingRoutes = require('./modules/wellbeing/wellbeing.routes'); 
const careplanRoutes = require('./modules/careplans/careplans.routes'); 
const documentRoutes = require('./modules/documents/document.routes'); 
const notesRoutes = require('./modules/notes/notes.routes'); 
const gpsRoutes = require('./modules/gps/gpslog.routes'); 
const offlineRoutes = require('./modules/offline/offlineRecord.routes'); 
const notificationRoutes = require('./modules/notifications/notification.routes'); 
const auditRoutes = require('./modules/audit/auditLog.routes'); 
const aiRoutes = require('./modules/ai/ai.routes'); 

// -----------------------------------------------------
// 6️⃣ Controllers for Socket.IO hooks
// -----------------------------------------------------
const notificationController = require('./modules/notifications/notification.controller');

// -----------------------------------------------------
// 7️⃣ Initialize Express & HTTP server
// -----------------------------------------------------
const app = express();
const server = http.createServer(app); // Needed for Socket.IO integration

// -----------------------------------------------------
// 8️⃣ Middleware Setup
// -----------------------------------------------------
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow frontend
app.use(express.json({ limit: '10mb' })); // Parse JSON body up to 10MB
app.use(cookieParser()); // Parse cookies

// -----------------------------------------------------
// 9️⃣ MongoDB Connection
// -----------------------------------------------------
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// -----------------------------------------------------
// 🔐 10️⃣ JWT Authentication Middleware
// -----------------------------------------------------
const authMiddleware = async (req, res, next) => {
    try {
        // Allow unauthenticated access to auth routes
        if (req.path.startsWith('/api/auth')) return next();

        // Retrieve JWT from Authorization header or cookie
        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        // Verify JWT and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Invalid user' });

        // Attach user to request
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(401).json({ message: 'Auth error' });
    }
};

// Apply JWT middleware globally
app.use(authMiddleware);

// -----------------------------------------------------
// 11️⃣ Socket.IO — AI Chat & Notifications
// -----------------------------------------------------
const io = new Server(server, {
    cors: { origin: 'http://localhost:3000', credentials: true },
});

// Pass Socket.IO instance to notification controller
notificationController.setSocketIO(io);

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('⚡ User connected to AI chat & notifications');

    // Handle AI chat messages
    socket.on('sendMessage', async (data) => {
        try {
            // Echo user message first
            io.emit('receiveMessage', { user: data.user || 'User', text: data.text });

            // Ask AI for response
            const aiReply = await askAI(data.text);
            io.emit('receiveMessage', { user: 'AI Assistant', text: aiReply });
        } catch (err) {
            console.error('AI Service Error:', err);
            io.emit('receiveMessage', { user: 'AI Assistant', text: 'Error generating summary' });
        }
    });

    // Handle disconnects
    socket.on('disconnect', () => console.log('⚡ User disconnected'));
});

// -----------------------------------------------------
// 12️⃣ Register API Routes
// -----------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/medication', medicationRoutes);
app.use('/api/mar', marRoutes);
app.use('/api/wellbeing', wellbeingRoutes);
app.use('/api/careplans', careplanRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/gps', gpsRoutes);
app.use('/api/offline', offlineRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/ai', aiRoutes); // AI endpoints

// Root route
app.get('/', (req, res) => res.send('Welcome to PrismCare API!'));

// -----------------------------------------------------
// 13️⃣ Start Server
// -----------------------------------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 API Server running on http://localhost:${PORT}`));

// Export app & server for testing
module.exports = { app, server };
