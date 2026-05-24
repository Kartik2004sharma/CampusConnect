const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

exports.initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5174',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    const role = socket.user.role;

    socket.join(`user:${userId}`);
    socket.join(`role:${role}`);
    
    // Simple in-memory or Redis-based map could go here, but Rooms are sufficient for emit ToUser and ToRole
    
    socket.on('disconnect', () => {
      // Clean up if needed
    });
  });

  return io;
};

exports.getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

exports.emitToUser = (userId, event, data) => {
  if (io) io.to(`user:${userId}`).emit(event, data);
};

exports.emitToRole = (role, event, data) => {
  if (io) io.to(`role:${role}`).emit(event, data);
};

exports.emitToAll = (event, data) => {
  if (io) io.emit(event, data);
};
