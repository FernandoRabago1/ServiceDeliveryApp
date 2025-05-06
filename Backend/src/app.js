// src/server.js
const path = require('path');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const { sequelize, port: APP_PORT, frontendOrigin } = require('./config/database.js');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const mainRouter = require('./routes'); // Rutas de tu Service Delivery App

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

// === Start server: test DB, sync models, listen ===
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sincronizar modelos (quita alter en producción o usa migraciones)
    await sequelize.sync();
    console.log('✅ Models synchronized.');

    if (require.main === module) {
      app.listen(APP_PORT, () =>
        console.log(`🚀 Server listening at http://localhost:${APP_PORT}`)
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
