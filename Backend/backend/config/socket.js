// socket.js
let io = null;

function initSocket(server) {
    const { Server } = require('socket.io');
    io = new Server(server, {
        cors: {
            origin: '*', // Update with frontend domain in production
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        // Optional: Join room by user ID
        socket.on('join', (userId) => {
            socket.join(userId.toString());
            console.log(`User ${userId} joined room ${userId}`);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized. Call initSocket(server) first.');
    }
    return io;
}

module.exports = { initSocket, getIO };
