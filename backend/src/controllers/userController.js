const pool   = require('../config/database');
const bcrypt = require('bcryptjs');

const updateProfile = async (req, res) => {
  const { name, phone, location, bio } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users
         SET name=$1, phone=$2, location=$3, bio=$4, updated_at=NOW()
       WHERE id=$5
       RETURNING id, name, email, role, phone, location, bio, avatar_url, is_verified`,
      [name, phone, location, bio, req.user.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Both passwords required' });
  }
  try {
    const { rows } = await pool.query('SELECT password FROM users WHERE id=$1', [req.user.id]);
    const valid = await bcrypt.compare(currentPassword, rows[0].password);
    if (!valid) return res.status(401).json({ success: false, message: 'Current password incorrect' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password=$1, updated_at=NOW() WHERE id=$2', [hashed, req.user.id]);
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getFarmers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.location, u.avatar_url, u.is_verified, u.bio,
             COUNT(DISTINCT p.id)   AS product_count,
             COALESCE(AVG(sr.rating), 0) AS avg_rating,
             COUNT(DISTINCT sr.id) AS total_reviews
      FROM users u
      LEFT JOIN products p  ON p.farmer_id = u.id AND p.is_available = TRUE
      LEFT JOIN supplier_ratings sr ON sr.farmer_id = u.id
      WHERE u.role = 'farmer' AND u.is_active = TRUE
      GROUP BY u.id
      ORDER BY avg_rating DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getFarmerById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.location, u.phone, u.avatar_url, u.is_verified, u.bio,
              COALESCE(AVG(sr.rating), 0) AS avg_rating,
              COUNT(DISTINCT sr.id) AS total_reviews
       FROM users u
       LEFT JOIN supplier_ratings sr ON sr.farmer_id = u.id
       WHERE u.id=$1 AND u.role='farmer'
       GROUP BY u.id`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { updateProfile, changePassword, getFarmers, getFarmerById };
