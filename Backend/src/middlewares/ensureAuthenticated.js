// src/middlewares/ensureAuthenticated.js
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const redis = require('../db/redis');

async function ensureAuthenticated(req, res, next) {
  // 1) Obtener token de la cookie
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    return res
      .status(401)
      .json({ message: 'Access token not found in cookies' });
  }

  // 2) Verificar si el token fue revocado en Redis
  const invalid = await redis.get(`invalid:access:${accessToken}`);
  if (invalid) {
    return res
      .status(401)
      .json({
        message: 'Access token has been revoked',
        code: 'AccessTokenInvalid'
      });
  }

  // 3) Verificar firma y expiración
  try {
    const decoded = jwt.verify(accessToken, config.accessTokenSecret);

    // Guardamos en req para que lo use el siguiente middleware/controlador
    req.accessToken = {
      value: accessToken,
      exp: decoded.exp
    };
    // Atención: usamos "uid" aquí para que coincida con tu modelo Sequelize
    req.user = {
      uid: decoded.userId
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: 'Access token expired', code: 'AccessTokenExpired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: 'Access token invalid', code: 'AccessTokenInvalid' });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ensureAuthenticated;
