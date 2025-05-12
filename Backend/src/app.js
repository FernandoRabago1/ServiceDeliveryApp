// src/server.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const rateLimit = require('express-rate-limit');

const { sequelize, port: APP_PORT, frontendOrigin } = require('./config/database.js');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const mainRouter = require('./routes'); // Rutas de tu Service Delivery App

// Importa tu WS (Socket.IO) configurado en src/ws.js
const { startWebSocketServer } = require('./ws');

const app = express();

// === Rate Limiter para login y 2FA ===
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 15,
  message: 'Too many requests, please try again after 15 minutes.'
});
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/login/2fa', loginLimiter);

// === Middlewares ===
app.use(cors({ origin: frontendOrigin, credentials: true }));
app.options('*', cors({ origin: frontendOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// === Health check ===
app.get('/', (req, res) => {
  res.send('Service Delivery App Backend and Auth API are running!');
});

// === Mount routers ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', mainRouter);

// === Error handler ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Something broke!'
      : err.message;
  res.status(status).json({ error: message });
});

// === Start server: test DB, sync models, listen HTTP + WS ===
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sincronizar modelos (quita alter en producción o usa migraciones)
    await sequelize.sync();
    console.log('✅ Models synchronized.');

    if (require.main === module) {
      // 1) Crea el servidor HTTP a partir de Express
      const server = http.createServer(app);

      // 2) Arranca WebSocket (Socket.IO) sobre ese mismo server
      startWebSocketServer(server);

      // 3) Arranca escucha HTTP
      server.listen(APP_PORT, () =>
        console.log(`🚀 HTTP listening at http://localhost:${APP_PORT}`)
      );
    }
  } catch (err) {
    console.error('❌ Unable to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
