const pool = require('../config/database');

const getProducts = async (req, res) => {
  try {
    const { category, location, min_price, max_price, quality, search, sort = 'newest', page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let conditions = ['p.is_available = TRUE', 'u.is_active = TRUE'];
    let params = [];
    let i = 1;

    if (category) { conditions.push(`c.slug = $${i++}`); params.push(category); }
    if (location) { conditions.push(`p.location ILIKE $${i++}`); params.push(`%${location}%`); }
    if (min_price) { conditions.push(`p.price >= $${i++}`); params.push(Number(min_price)); }
    if (max_price) { conditions.push(`p.price <= $${i++}`); params.push(Number(max_price)); }
    if (quality) { conditions.push(`p.quality = $${i++}`); params.push(quality); }
    if (search) {
      conditions.push(`(p.name ILIKE $${i} OR p.description ILIKE $${i++})`);
      params.push(`%${search}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const sortMap = {
      newest: 'p.created_at DESC',
      cheapest: 'p.price ASC',
      expensive: 'p.price DESC',
      popular: 'p.views DESC',
    };
    const orderBy = sortMap[sort] || 'p.created_at DESC';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products p 
       JOIN users u ON p.farmer_id = u.id 
       LEFT JOIN categories c ON p.category_id = c.id 
       ${where}`,
      params
    );

    const result = await pool.query(
      `SELECT p.*, 
         c.name as category_name, c.slug as category_slug, c.icon as category_icon,
         u.name as farmer_name, u.location as farmer_location, u.avatar_url as farmer_avatar, u.is_verified as farmer_verified,
         COALESCE(AVG(sr.rating), 0) as avg_rating,
         COUNT(DISTINCT sr.id) as total_reviews
       FROM products p
       JOIN users u ON p.farmer_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN supplier_ratings sr ON sr.farmer_id = p.farmer_id
       ${where}
       GROUP BY p.id, c.id, u.id
       ORDER BY ${orderBy}
       LIMIT $${i} OFFSET $${i + 1}`,
      [...params, Number(limit), offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(countResult.rows[0].count / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getProduct = async (req, res) => {
  try {
    await pool.query('UPDATE products SET views = views + 1 WHERE id = $1', [req.params.id]);

    const result = await pool.query(
      `SELECT p.*, 
         c.name as category_name, c.slug as category_slug, c.icon as category_icon,
         u.name as farmer_name, u.email as farmer_email, u.phone as farmer_phone,
         u.location as farmer_location, u.avatar_url as farmer_avatar, 
         u.is_verified as farmer_verified, u.bio as farmer_bio,
         COALESCE(AVG(sr.rating), 0) as avg_rating,
         COUNT(DISTINCT sr.id) as total_reviews
       FROM products p
       JOIN users u ON p.farmer_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN supplier_ratings sr ON sr.farmer_id = p.farmer_id
       WHERE p.id = $1
       GROUP BY p.id, c.id, u.id`,
      [req.params.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  const { name, description, category_id, price, unit, stock, min_order, quality, location } = req.body;
  const image_url = req.file?.path || req.body.image_url || null;

  try {
    const result = await pool.query(
      `INSERT INTO products (farmer_id, category_id, name, description, price, unit, stock, min_order, quality, location, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [req.user.id, category_id, name, description, price, unit, stock, min_order || 1, quality || 'Grade A', location, image_url]
    );
    res.status(201).json({ success: true, message: 'Product created', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  const { name, description, category_id, price, unit, stock, min_order, quality, location, is_available } = req.body;
  const image_url = req.file?.path || req.body.image_url;

  try {
    const existing = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!existing.rows[0]) return res.status(404).json({ success: false, message: 'Product not found' });
    if (existing.rows[0].farmer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const result = await pool.query(
      `UPDATE products SET
         name = COALESCE($1, name), description = COALESCE($2, description),
         category_id = COALESCE($3, category_id), price = COALESCE($4, price),
         unit = COALESCE($5, unit), stock = COALESCE($6, stock),
         min_order = COALESCE($7, min_order), quality = COALESCE($8, quality),
         location = COALESCE($9, location), image_url = COALESCE($10, image_url),
         is_available = COALESCE($11, is_available), updated_at = NOW()
       WHERE id = $12 RETURNING *`,
      [name, description, category_id, price, unit, stock, min_order, quality, location, image_url, is_available, req.params.id]
    );
    res.json({ success: true, message: 'Product updated', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const existing = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!existing.rows[0]) return res.status(404).json({ success: false, message: 'Product not found' });
    if (existing.rows[0].farmer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name, c.icon as category_icon
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.farmer_id = $1 ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getMyProducts };
