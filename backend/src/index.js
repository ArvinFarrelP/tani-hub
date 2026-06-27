require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes        = require('./routes/auth');
const productRoutes     = require('./routes/products');
const categoryRoutes    = require('./routes/categories');
const transactionRoutes = require('./routes/transactions');
const adminRoutes       = require('./routes/admin');
const userRoutes        = require('./routes/users');
const ratingRoutes      = require('./routes/ratings');

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/products',     productRoutes);
app.use('/api/categories',   categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/ratings',      ratingRoutes);

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', service: 'Tani Hub API', timestamp: new Date() })
);

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` })
);

// ── Global error handler ──────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌾  Tani Hub API  →  http://localhost:${PORT}/api`);
  console.log(`   Health check     →  http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
