const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');

exports.addReview = async ({ user_id, service_id, rating, comments }) => {
  const review_id = uuidv4();
  const timestamp = new Date().toISOString();
  const query = `
    INSERT INTO reviews (review_id, user_id, service_id, rating, comments, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [review_id, user_id, service_id, rating, comments, timestamp];
  const { rows } = await db.query(query, values);
  return rows[0];
};

exports.getReviewsByServiceId = async (service_id) => {
  const query = `SELECT * FROM reviews WHERE service_id = $1 ORDER BY timestamp DESC`;
  const { rows } = await db.query(query, [service_id]);
  return rows;
};

exports.getReviewsByUserId = async (user_id) => {
  const query = `SELECT * FROM reviews WHERE user_id = $1 ORDER BY timestamp DESC`;
  const { rows } = await db.query(query, [user_id]);
  return rows;
};
