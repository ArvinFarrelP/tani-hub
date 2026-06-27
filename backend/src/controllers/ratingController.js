const pool = require('../config/database');

const createRating = async (req, res) => {
  const { farmer_id, transaction_id, rating, review } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be 1–5' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO supplier_ratings (farmer_id, buyer_id, transaction_id, rating, review)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (transaction_id, buyer_id)
         DO UPDATE SET rating=$4, review=$5, created_at=NOW()
       RETURNING *`,
      [farmer_id, req.user.id, transaction_id, rating, review]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getFarmerRatings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sr.*, u.name AS buyer_name
       FROM supplier_ratings sr
       JOIN users u ON u.id = sr.buyer_id
       WHERE sr.farmer_id=$1
       ORDER BY sr.created_at DESC`,
      [req.params.farmerId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createRating, getFarmerRatings };
