// src/db/redis.js
const config = require('../config/database');
let redis;

if (process.env.NODE_ENV === 'test') {
  // un “fake” que satisface la API básica
  redis = {
    get:    async () => null,
    setex:  async () => {},
    del:    async () => {}
  };
} else {
  const Redis = require('ioredis');
  redis = new Redis({
    host:     config.redisHost,
    port:     config.redisPort,
    password: config.redisPassword
  });
}

module.exports = redis;
