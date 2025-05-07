// src/ws.js
const http = require('http');
const { Server } = require('socket.io');
const cookie = require('cookie');

const { wsPort }         = require('./config/database');
const { saveMessage }    = require('./models/message.model');
const { setOnline, getAllOnline } = require('./models/presence.model');

const sockets = new Map(); // userId → socket

function broadcastPresence(userId, online) {
  const payload = { type: 'presence', id: userId, online };
  for (const [uid, sock] of sockets.entries()) {
    if (uid !== userId) sock.emit('presence', payload);
  }
}

function startWebSocketServer(app) {
  const server = http.createServer(); 

  server.listen(wsPort, () => {
    console.log(`🔌 WS listening on ws://localhost:${wsPort}`);
  });

  const io = new Server(server, {
    cors: {
      origin: '*' // o tu frontendOrigin
    }
  });

  io.use((socket, next) => {
    // ejemplo leyendo userId de query
    const { userId } = socket.handshake.query;
    if (!userId) return next(new Error('userId missing'));
    socket.userId = userId;
    next();
  });

  io.on('connection', (socket) => {
    const uid = socket.userId;
    sockets.set(uid, socket);
    setOnline(uid, true);

    // envío lista inicial de online
    socket.emit('init', { online: getAllOnline() });
    broadcastPresence(uid, true);

    socket.on('message', async ({ to, body }) => {
      try {
        const rec = await saveMessage({ senderId: uid, receiverId: to, body });
        const payload = { type: 'sent', ...rec.toJSON() };
        socket.emit('sent', payload);
        sockets.get(to)?.emit('incoming', payload);
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    socket.on('disconnect', () => {
      sockets.delete(uid);
      setOnline(uid, false);
      broadcastPresence(uid, false);
    });
  });

  return io;
}

module.exports = { startWebSocketServer };
