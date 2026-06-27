const pool = require('../config/database');

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_available = TRUE
      GROUP BY c.id
      ORDER BY c.name
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  const { name, slug, icon, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (name, slug, icon, description) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, slug, icon, description]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Slug already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  const { name, slug, icon, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categories SET name=COALESCE($1,name), slug=COALESCE($2,slug), icon=COALESCE($3,icon), description=COALESCE($4,description) WHERE id=$5 RETURNING *',
      [name, slug, icon, description, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
