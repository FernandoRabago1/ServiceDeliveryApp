const { User } = require('../models');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Find all users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findByPk(uid);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    // Log the error for server-side debugging
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user information
exports.updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const [updated] = await User.update(req.body, {
      where: { uid: uid }
    });
    if (updated) {
      const updatedUser = await User.findByPk(uid);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const deleted = await User.destroy({
      where: { uid: uid }
    });
    if (deleted) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};