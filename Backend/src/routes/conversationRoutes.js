// src/routes/conversationRoutes.js
const express = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const conversationController = require('../controllers/conversationController');

const router = express.Router();

// Todas estas rutas requieren el token de acceso en cookies:
router.get(
  '/conversations',
  ensureAuthenticated,
  conversationController.list
);

router.get(
  '/conversations/:withUserId/messages',
  ensureAuthenticated,
  conversationController.history
);

router.post(
  '/conversations/:withUserId/read',
  ensureAuthenticated,
  conversationController.markRead
);

module.exports = router;
