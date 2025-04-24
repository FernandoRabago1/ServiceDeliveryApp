const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

exports.getAll = async () => {
  const res = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
  return res.rows;
};

exports.create = async ({ provider_id, description, category, pricing_model }) => {
  const res = await pool.query(
    `INSERT INTO services (provider_id, description, category, pricing_model)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [provider_id, description, category, pricing_model]
  );
  return res.rows[0];
};

exports.update = async (id, data) => {
  const fields = Object.keys(data).map((key, i) => `${key}=$${i + 1}`);
  const values = Object.values(data);
  const res = await pool.query(
    `UPDATE services SET ${fields.join(', ')} WHERE service_id=$${fields.length + 1} RETURNING *`,
    [...values, id]
  );
  return res.rows[0];
};

exports.remove = async (id) => {
  await pool.query('DELETE FROM services WHERE service_id=$1', [id]);
};

exports.findByCategory = async (category) => {
  const res = await pool.query('SELECT * FROM services WHERE category=$1', [category]);
  return res.rows;
};
