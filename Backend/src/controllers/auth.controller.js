// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');
const crypto = require('crypto');

const config = require('../config/database');
const cache = require('../utils/cache');    // para tempToken de 2FA
const redis = require('../db/redis');      // para refresh tokens
const {
  findOneByEmail,
  findOneById,
  insertUser,
  updateUser
} = require('../models');

const baseCookieOptions = {
  httpOnly: true,
  secure: false, // true en producción con HTTPS
  sameSite: 'lax'
};

function parseExpiresIn(expiresInString) {
  const match = expiresInString.match(/^(\d+)([smhdw])$/);
  if (!match) return 0;
  const amount = parseInt(match[1], 10);
  switch (match[2]) {
    case 's': return amount;
    case 'm': return amount * 60;
    case 'h': return amount * 3600;
    case 'd': return amount * 86400;
    case 'w': return amount * 604800;
    default: return 0;
  }
}

const accessTokenSeconds = parseExpiresIn(config.accessTokenExpiresIn);
const refreshTokenSeconds = parseExpiresIn(config.refreshTokenExpiresIn);

function validatePasswordPolicy(password) {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
  if (!regex.test(password)) {
    return 'Password must include uppercase, lowercase, digit, and special character.';
  }
  return null;
}

// ========================
// REGISTRO
// ========================
async function register(req, res) {
  try {
    const { name, email, password, role, is_worker } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json({ message: 'name, email and password are required' });
    }
    const policyError = validatePasswordPolicy(password);
    if (policyError) {
      return res.status(422).json({ message: policyError });
    }

    if (await findOneByEmail(email)) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await insertUser({
      name,
      email,
      password: hashedPassword,
      role: role ?? 'member',
      twofaEnable: false,
      twofaSecret: null,
      is_worker
    });

    return res.status(201).json({
      message: 'User registered successfully',
      uid: newUser.uid
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ========================
// LOGIN
// ========================
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ message: 'email and password are required' });
    }

    const user = await findOneByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email or password is invalid' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Email or password is invalid' });
    }

    if (user.twofaEnable) {
      const tempToken = crypto.randomUUID();
      cache.set(
        config.cacheTemporaryTokenPrefix + tempToken,
        user.uid,
        config.cacheTemporaryTokenExpiresInSeconds
      );
      return res.status(200).json({
        tempToken,
        expiresInSeconds: config.cacheTemporaryTokenExpiresInSeconds
      });
    }

    const accessToken = jwt.sign(
      { userId: user.uid },
      config.accessTokenSecret,
      { subject: 'accessApi', expiresIn: config.accessTokenExpiresIn }
    );
    const refreshToken = jwt.sign(
      { userId: user.uid },
      config.refreshTokenSecret,
      { subject: 'refreshToken', expiresIn: config.refreshTokenExpiresIn }
    );

    await redis.setex(`refresh:${refreshToken}`, refreshTokenSeconds, user.uid);

    res.cookie('accessToken', accessToken, {
      ...baseCookieOptions,
      maxAge: accessTokenSeconds * 1000
    });
    res.cookie('refreshToken', refreshToken, {
      ...baseCookieOptions,
      maxAge: refreshTokenSeconds * 1000
    });

    return res.status(200).json({
      uid: user.uid,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ========================
// LOGIN 2FA
// ========================
async function login2FA(req, res) {
  try {
    const { tempToken, totp } = req.body;
    if (!tempToken || !totp) {
      return res.status(422).json({ message: 'tempToken and totp are required' });
    }

    const userUid = cache.get(config.cacheTemporaryTokenPrefix + tempToken);
    if (!userUid) {
      return res.status(401).json({ message: 'Temporary token invalid or expired' });
    }

    const user = await findOneById(userUid);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!authenticator.check(totp, user.twofaSecret)) {
      return res.status(401).json({ message: 'TOTP is invalid or expired' });
    }

    const accessToken = jwt.sign(
      { userId: user.uid },
      config.accessTokenSecret,
      { subject: 'accessApi', expiresIn: config.accessTokenExpiresIn }
    );
    const refreshToken = jwt.sign(
      { userId: user.uid },
      config.refreshTokenSecret,
      { subject: 'refreshToken', expiresIn: config.refreshTokenExpiresIn }
    );

    await redis.setex(`refresh:${refreshToken}`, refreshTokenSeconds, user.uid);

    res.cookie('accessToken', accessToken, {
      ...baseCookieOptions,
      maxAge: accessTokenSeconds * 1000
    });
    res.cookie('refreshToken', refreshToken, {
      ...baseCookieOptions,
      maxAge: refreshTokenSeconds * 1000
    });

    return res.status(200).json({
      uid: user.uid,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ========================
// REFRESH TOKEN
// ========================
async function refreshToken(req, res) {
  try {
    const oldToken = req.cookies?.refreshToken;
    if (!oldToken) {
      return res.status(401).json({ message: 'No refresh token cookie found' });
    }

    const decoded = jwt.verify(oldToken, config.refreshTokenSecret);
    const stored = await redis.get(`refresh:${oldToken}`);
    if (!stored) {
      return res.status(401).json({ message: 'Refresh token invalid or expired' });
    }

    await redis.del(`refresh:${oldToken}`);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      config.accessTokenSecret,
      { subject: 'accessApi', expiresIn: config.accessTokenExpiresIn }
    );
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      config.refreshTokenSecret,
      { subject: 'refreshToken', expiresIn: config.refreshTokenExpiresIn }
    );

    await redis.setex(`refresh:${newRefreshToken}`, refreshTokenSeconds, decoded.userId);

    res.cookie('accessToken', newAccessToken, {
      ...baseCookieOptions,
      maxAge: accessTokenSeconds * 1000
    });
    res.cookie('refreshToken', newRefreshToken, {
      ...baseCookieOptions,
      maxAge: refreshTokenSeconds * 1000
    });

    return res.status(200).json({ message: 'Access token refreshed successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Refresh token invalid or expired' });
    }
    return res.status(500).json({ message: error.message });
  }
}

// ========================
// GENERATE 2FA
// ========================
async function generate2FA(req, res) {
  try {
    const user = await findOneById(req.user.uid);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(user.email, 'YourAppName', secret);

    await updateUser(user.uid, { twofaSecret: secret });

    const qrCode = await qrcode.toBuffer(uri, { type: 'image/png', margin: 1 });
    res.setHeader('Content-Disposition', 'attachment; filename=qrcode.png');
    return res.status(200).type('image/png').send(qrCode);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ========================
// VALIDATE 2FA
// ========================
async function validate2FA(req, res) {
  try {
    const { totp } = req.body;
    if (!totp) {
      return res.status(422).json({ message: 'TOTP is required' });
    }

    const user = await findOneById(req.user.uid);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!authenticator.check(totp, user.twofaSecret)) {
      return res.status(400).json({ message: 'TOTP is not correct or expired' });
    }

    await updateUser(user.uid, { twofaEnable: true });
    return res.status(200).json({ message: '2FA enabled successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ========================
// LOGOUT
// ========================
async function logout(req, res) {
  try {
    if (req.accessToken) {
      const ttl = req.accessToken.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redis.setex(`invalid:access:${req.accessToken.value}`, ttl, 'true');
      }
    }

    const oldRefresh = req.cookies?.refreshToken;
    if (oldRefresh) {
      const decoded = jwt.verify(oldRefresh, config.refreshTokenSecret);
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redis.setex(`invalid:refresh:${oldRefresh}`, ttl, 'true');
      }
      await redis.del(`refresh:${oldRefresh}`);
    }

    res.clearCookie('accessToken', baseCookieOptions);
    res.clearCookie('refreshToken', baseCookieOptions);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  login,
  login2FA,
  refreshToken,
  generate2FA,
  validate2FA,
  logout
};
