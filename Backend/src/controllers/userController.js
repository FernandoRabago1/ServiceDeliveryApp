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