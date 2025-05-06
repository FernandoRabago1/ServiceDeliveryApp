// src/routes/auth.routes.js
const express = require('express');
const {
  register,
  login,
  login2FA,
  refreshToken,
  generate2FA,
  validate2FA,
  logout
} = require('../controllers/auth.controller');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const router = express.Router();

// Registro de usuario
router.post('/register', register);

// Login normal y 2FA
router.post('/login', login);
router.post('/login/2fa', login2FA);

// Refresh de token
router.post('/refresh-token', refreshToken);

// Endpoints protegidos de 2FA
router.get('/2fa/generate', ensureAuthenticated, generate2FA);
router.post('/2fa/validate', ensureAuthenticated, validate2FA);

// Logout (revoca tokens)
router.get('/logout', ensureAuthenticated, logout);

module.exports = router;
