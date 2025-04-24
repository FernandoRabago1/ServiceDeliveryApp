const { createClient } = require('redis');

const client = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`
});

client.connect();
client.on('error', err => console.error('Redis Client Error', err));

module.exports = client;
