const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Route to create a new user
router.post('/users', userController.createUser);

// Route to update user information
router.put('/users/:uid', userController.updateUser);

// Route to delete a user
router.delete('/users/:uid', userController.deleteUser);

// Route to get a user by ID
router.get('/users/:uid', userController.getUserById);

module.exports = router;