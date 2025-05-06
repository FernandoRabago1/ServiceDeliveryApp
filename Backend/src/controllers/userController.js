// src/controllers/user.controller.js
const { User, findOneById } = require('../models');

// GET /api/users/current
async function getCurrent(req, res) {
  try {
    // ensureAuthenticated debe haber puesto req.user.uid
    const user = await findOneById(req.user.uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      uid: user.uid,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// GET /api/users/admin
function getAdmin(req, res) {
  return res
    .status(200)
    .json({ message: 'Only admins can access this route!' });
}

// GET /api/users/moderator
function getModerator(req, res) {
  return res
    .status(200)
    .json({ message: 'Only admins and moderators can access this route!' });
}

// POST /api/users
async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// GET /api/users
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/users/:uid
async function getUserById(req, res) {
  try {
    const { uid } = req.params;
    const user = await User.findByPk(uid);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT /api/users/:uid
async function updateUser(req, res) {
  try {
    const { uid } = req.params;
    const [updated] = await User.update(req.body, {
      where: { uid }
    });
    if (updated) {
      const updatedUser = await User.findByPk(uid);
      return res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// DELETE /api/users/:uid
async function deleteUser(req, res) {
  try {
    const { uid } = req.params;
    const deleted = await User.destroy({
      where: { uid }
    });
    if (deleted) {
      return res.sendStatus(204);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getCurrent,
  getAdmin,
  getModerator,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
