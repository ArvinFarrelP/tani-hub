require('dotenv').config();
const pool = require('./database');

const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log('🔄 Running migrations...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'buyer' CHECK (role IN ('admin','farmer','buyer')),
        phone VARCHAR(20),
        location VARCHAR(200),
        avatar_url TEXT,
        bio TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        icon VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        farmer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(12,2) NOT NULL,
        unit VARCHAR(20) NOT NULL DEFAULT 'kg' CHECK (unit IN ('kg','ton','ikat','buah','pack')),
        stock DECIMAL(12,2) NOT NULL DEFAULT 0,
        min_order DECIMAL(12,2) DEFAULT 1,
        quality VARCHAR(50) DEFAULT 'Grade A' CHECK (quality IN ('Grade A','Grade B','Grade C','Premium','Organik')),
        location VARCHAR(200),
        image_url TEXT,
        is_available BOOLEAN DEFAULT TRUE,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
        buyer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        farmer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        quantity DECIMAL(12,2) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        price_per_unit DECIMAL(12,2) NOT NULL,
        total_price DECIMAL(12,2) NOT NULL,
        status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
        notes TEXT,
        delivery_address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS supplier_ratings (
        id SERIAL PRIMARY KEY,
        farmer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        transaction_id INTEGER REFERENCES transactions(id) ON DELETE SET NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(transaction_id, buyer_id)
      );
    `);

    // Indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_farmer ON products(farmer_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);`);

    console.log('✅ Migrations completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
