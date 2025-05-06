// src/routes/user.routes.js
const express = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { authorize } = require('../middlewares/authorize');
const {
  getCurrent,
  getAdmin,
  getModerator,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// Devuelve los datos del usuario actual (usa req.user.uid)
router.get('/current', ensureAuthenticated, getCurrent);

// Solo administradores
router.get('/admin', ensureAuthenticated, authorize(['admin']), getAdmin);

// Administradores y moderadores
router.get(
  '/moderator',
  ensureAuthenticated,
  authorize(['admin', 'moderator']),
  getModerator
);

module.exports = router;
