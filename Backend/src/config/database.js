const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });



const config = {
  // JWT & Tokens
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'myAccessTokenSecret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'myRefreshTokenSecret',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  // Cache (Redis)
  cacheTemporaryTokenPrefix:
    process.env.CACHE_TEMPORARY_TOKEN_PREFIX || 'temp_token:',
  cacheTemporaryTokenExpiresInSeconds:
    parseInt(process.env.CACHE_TEMPORARY_TOKEN_EXPIRES_IN_SECONDS, 10) || 180,

  // Server
  port: parseInt(process.env.PORT, 10) || 3000,
  frontendOrigin: process.env.REACT_APP_API_URL || 'http://localhost:3001',

  // Redis Config
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT, 10) || 6379,
  redisPassword: process.env.REDIS_PASSWORD || '',
};

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: false, // Disable logging or set to console.log for debugging
});

const wsPort = parseInt(process.env.WS_PORT, 10) || 4101;

module.exports = {
  ...config,
  sequelize,
  wsPort,
};

