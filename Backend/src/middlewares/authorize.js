// src/middlewares/authorize.js
const { findOneById } = require('../models');

/**
 * Middleware de autorización basado en roles.
 * @param {string[]} roles — Lista de roles permitidos (e.g. ['admin','moderator'])
 */
function authorize(roles = []) {
  return async (req, res, next) => {
    try {
      // Asumimos que ensureAuthenticated ya puso req.user.uid
      const user = await findOneById(req.user.uid);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
}

module.exports = { authorize };
