const pool = require('../config/database');

const getMyTransactions = async (req, res) => {
  try {
    const field = req.user.role === 'farmer' ? 't.farmer_id' : 't.buyer_id';
    const result = await pool.query(
      `SELECT t.*, p.name as product_name, p.image_url as product_image, p.unit as product_unit,
         b.name as buyer_name, b.email as buyer_email, b.phone as buyer_phone,
         f.name as farmer_name, f.email as farmer_email, f.phone as farmer_phone
       FROM transactions t
       JOIN products p ON t.product_id = p.id
       JOIN users b ON t.buyer_id = b.id
       JOIN users f ON t.farmer_id = f.id
       WHERE ${field} = $1
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createTransaction = async (req, res) => {
  const { product_id, quantity, notes, delivery_address } = req.body;

  try {
    const product = await pool.query('SELECT * FROM products WHERE id = $1 AND is_available = TRUE', [product_id]);
    if (!product.rows[0]) return res.status(404).json({ success: false, message: 'Product not found or unavailable' });

    const p = product.rows[0];
    if (quantity > p.stock) return res.status(400).json({ success: false, message: 'Insufficient stock' });

    const total_price = quantity * p.price;

    const result = await pool.query(
      `INSERT INTO transactions (product_id, buyer_id, farmer_id, quantity, unit, price_per_unit, total_price, notes, delivery_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [product_id, req.user.id, p.farmer_id, quantity, p.unit, p.price, total_price, notes, delivery_address]
    );

    await pool.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [quantity, product_id]);

    res.status(201).json({ success: true, message: 'Order placed successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateTransactionStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  try {
    const t = await pool.query('SELECT * FROM transactions WHERE id = $1', [req.params.id]);
    if (!t.rows[0]) return res.status(404).json({ success: false, message: 'Transaction not found' });

    const isOwner = t.rows[0].farmer_id === req.user.id || t.rows[0].buyer_id === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const result = await pool.query(
      'UPDATE transactions SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json({ success: true, message: 'Status updated', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getMyTransactions, createTransaction, updateTransactionStatus };
