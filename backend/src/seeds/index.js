require('dotenv').config();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const seed = async () => {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding database...');

    // Users
    const adminPass = await bcrypt.hash('Admin123!', 10);
    const farmerPass = await bcrypt.hash('Petani123!', 10);
    const buyerPass = await bcrypt.hash('Buyer123!', 10);

    await client.query(`
      INSERT INTO users (name, email, password, role, phone, location, is_verified, bio) VALUES
      ('Admin Tani Hub', 'admin@tanihub.id', '${adminPass}', 'admin', '081234567890', 'Jakarta', TRUE, 'Platform administrator'),
      ('Budi Santoso', 'petani@tanihub.id', '${farmerPass}', 'farmer', '082345678901', 'Boyolali, Jawa Tengah', TRUE, 'Petani sayuran organik berpengalaman 15 tahun di dataran tinggi Boyolali.'),
      ('Pak Slamet Raharjo', 'slamet@tanihub.id', '${farmerPass}', 'farmer', '083456789012', 'Malang, Jawa Timur', TRUE, 'Spesialis buah-buahan tropis. Kebun apel dan jeruk organik.'),
      ('Ibu Suryani', 'suryani@tanihub.id', '${farmerPass}', 'farmer', '084567890123', 'Magelang, Jawa Tengah', FALSE, 'Petani padi dan jagung organik dengan lahan 5 hektar.'),
      ('PT Restoran Nusantara', 'buyer@tanihub.id', '${buyerPass}', 'buyer', '021-5555-1234', 'Jakarta Selatan', FALSE, 'Jaringan restoran masakan Indonesia dengan 20 cabang di Jabodetabek.'),
      ('Hotel Bintang Lima Semarang', 'hotel@tanihub.id', '${buyerPass}', 'buyer', '024-7777-8888', 'Semarang, Jawa Tengah', FALSE, 'Hotel bintang 5 membutuhkan pasokan sayuran segar berkualitas premium.')
      ON CONFLICT (email) DO NOTHING;
    `);

    // Categories
    await client.query(`
      INSERT INTO categories (name, slug, icon, description) VALUES
      ('Sayuran', 'sayuran', '🥬', 'Berbagai jenis sayuran segar dari petani lokal'),
      ('Buah-buahan', 'buah-buahan', '🍎', 'Buah tropis dan subtropis pilihan'),
      ('Biji-bijian & Serealia', 'biji-bijian', '🌾', 'Padi, jagung, kedelai, dan biji-bijian lainnya'),
      ('Rempah-rempah', 'rempah-rempah', '🌶️', 'Rempah segar dan kering berkualitas tinggi'),
      ('Umbi-umbian', 'umbi-umbian', '🥔', 'Singkong, ubi, kentang, dan umbi-umbian'),
      ('Produk Organik', 'organik', '🌿', 'Produk pertanian bersertifikat organik')
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Products
    await client.query(`
      INSERT INTO products (farmer_id, category_id, name, description, price, unit, stock, min_order, quality, location, image_url, is_available) VALUES
      (2, 1, 'Bayam Organik Segar', 'Bayam organik ditanam tanpa pestisida kimia, dipanen pagi hari untuk menjaga kesegaran. Kaya zat besi dan nutrisi.', 8500, 'kg', 500, 10, 'Organik', 'Boyolali, Jawa Tengah', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800', TRUE),
      (2, 1, 'Kangkung Hidroponik', 'Kangkung segar dari sistem hidroponik modern, bebas tanah dan pestisida. Siap panen 2x seminggu.', 7000, 'kg', 800, 20, 'Premium', 'Boyolali, Jawa Tengah', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800', TRUE),
      (2, 1, 'Selada Keriting', 'Selada keriting premium untuk kebutuhan hotel dan restoran. Grade A, bersih, dan segar.', 15000, 'kg', 300, 5, 'Grade A', 'Boyolali, Jawa Tengah', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800', TRUE),
      (2, 4, 'Cabai Merah Besar', 'Cabai merah besar segar dari petani Boyolali. Tingkat kepedasan sedang, cocok untuk industri makanan.', 35000, 'kg', 1000, 50, 'Grade A', 'Boyolali, Jawa Tengah', 'https://images.unsplash.com/photo-1588975210820-1750dfe97e60?w=800', TRUE),
      (3, 2, 'Apel Manalagi Malang', 'Apel Manalagi khas Malang, manis renyah. Langsung dari kebun organik di dataran tinggi Batu, Malang.', 25000, 'kg', 2000, 100, 'Grade A', 'Malang, Jawa Timur', 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800', TRUE),
      (3, 2, 'Jeruk Siam Manis', 'Jeruk Siam manis premium dari Malang. Kadar air tinggi, rasa manis segar, cocok untuk juice dan konsumsi langsung.', 18000, 'kg', 3000, 100, 'Premium', 'Malang, Jawa Timur', 'https://images.unsplash.com/photo-1547514701-42782101795e?w=800', TRUE),
      (3, 2, 'Pisang Cavendish', 'Pisang Cavendish export quality. Dipanen pada tingkat kematangan optimal untuk distribusi jarak jauh.', 12000, 'kg', 5000, 200, 'Grade A', 'Malang, Jawa Timur', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800', TRUE),
      (4, 3, 'Beras Pandan Wangi', 'Beras pandan wangi premium dari Magelang. Aroma wangi alami, pulen, dan lezat. Cocok untuk hotel dan restoran bintang.', 14000, 'kg', 10000, 100, 'Premium', 'Magelang, Jawa Tengah', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800', TRUE),
      (4, 3, 'Jagung Manis Hibrida', 'Jagung manis hibrida F1, kadar gula tinggi, cocok untuk kebutuhan industri makanan dan restoran.', 6000, 'kg', 8000, 200, 'Grade A', 'Magelang, Jawa Tengah', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800', TRUE),
      (2, 5, 'Kentang Granola', 'Kentang Granola segar dari dataran tinggi. Ukuran seragam, cocok untuk industri makanan (keripik, french fries).', 9000, 'kg', 5000, 200, 'Grade A', 'Boyolali, Jawa Tengah', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800', TRUE)
      ON CONFLICT DO NOTHING;
    `);

    // Sample transactions
    await client.query(`
      INSERT INTO transactions (product_id, buyer_id, farmer_id, quantity, unit, price_per_unit, total_price, status, notes, delivery_address) VALUES
      (1, 5, 2, 100, 'kg', 8500, 850000, 'delivered', 'Untuk kebutuhan mingguan restoran', 'Jl. Sudirman No. 45, Jakarta Selatan'),
      (5, 5, 3, 500, 'kg', 25000, 12500000, 'processing', 'Pesanan bulanan buah segar', 'Jl. Sudirman No. 45, Jakarta Selatan'),
      (8, 6, 4, 1000, 'kg', 14000, 14000000, 'confirmed', 'Beras premium untuk hotel', 'Jl. Pemuda No. 123, Semarang'),
      (4, 5, 2, 200, 'kg', 35000, 7000000, 'pending', 'Cabai untuk dapur restoran', 'Jl. Sudirman No. 45, Jakarta Selatan')
      ON CONFLICT DO NOTHING;
    `);

    // Ratings
    await client.query(`
      INSERT INTO supplier_ratings (farmer_id, buyer_id, transaction_id, rating, review) VALUES
      (2, 5, 1, 5, 'Bayam sangat segar dan sesuai standar, pengiriman tepat waktu!'),
      (3, 5, 2, 4, 'Apel berkualitas baik, packaging perlu ditingkatkan.')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Demo accounts:');
    console.log('  Admin:  admin@tanihub.id / Admin123!');
    console.log('  Farmer: petani@tanihub.id / Petani123!');
    console.log('  Buyer:  buyer@tanihub.id / Buyer123!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
