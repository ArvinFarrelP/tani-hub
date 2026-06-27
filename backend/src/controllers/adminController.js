const pool = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    const [users, products, transactions, revenue] = await Promise.all([
      pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE role = $1) as farmers, COUNT(*) FILTER (WHERE role = $2) as buyers FROM users WHERE is_active = TRUE', ['farmer', 'buyer']),
      pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_available = TRUE) as active FROM products'),
      pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = $1) as pending FROM transactions', ['pending']),
      pool.query("SELECT COALESCE(SUM(total_price), 0) as total FROM transactions WHERE status = 'delivered'"),
    ]);

    res.json({
      success: true,
      data: {
        users: users.rows[0],
        products: products.rows[0],
        transactions: transactions.rows[0],
        revenue: revenue.rows[0],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.phone, u.location, u.is_verified, u.is_active, u.created_at,
         COUNT(DISTINCT p.id) as product_count
       FROM users u
       LEFT JOIN products p ON p.farmer_id = u.id
       WHERE u.role != 'admin'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const verifySupplier = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE users SET is_verified = NOT is_verified, updated_at = NOW() WHERE id = $1 AND role = $2 RETURNING id, name, email, is_verified',
      [req.params.id, 'farmer']
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, message: `Supplier ${result.rows[0].is_verified ? 'verified' : 'unverified'}`, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE users SET is_active = NOT is_active WHERE id = $1 RETURNING id, name, is_active',
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: `User ${result.rows[0].is_active ? 'activated' : 'deactivated'}`, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, p.name as product_name, b.name as buyer_name, f.name as farmer_name
       FROM transactions t
       JOIN products p ON t.product_id = p.id
       JOIN users b ON t.buyer_id = b.id
       JOIN users f ON t.farmer_id = f.id
       ORDER BY t.created_at DESC LIMIT 100`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDashboardStats, getAllUsers, verifySupplier, toggleUserStatus, getAllTransactions };
