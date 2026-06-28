# 🌾 Tani Hub

**Platform Digital Agritech** yang menghubungkan petani langsung dengan pembeli skala besar — hotel, restoran, kafe, supermarket, katering, dan industri makanan.

---

## 🚀 Tech Stack

| Layer        | Technology                      |
| ------------ | ------------------------------- |
| Frontend     | React.js + Tailwind CSS         |
| Backend      | Node.js + Express.js            |
| Database     | PostgreSQL                      |
| Auth         | JWT + Role-Based Access Control |
| Image Upload | Cloudinary                      |
| Container    | Docker + Docker Compose         |
| Deployment   | Vercel (FE) + AWS EC2           |

---

## 📁 Project Structure

```
tani-hub/
├── frontend/                # React.js application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── context/         # React Context (Auth, etc.)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # Axios API calls
│   │   └── utils/           # Helper functions
│   ├── public/
│   └── package.json
│
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── middleware/       # Auth, validation, upload
│   │   ├── routes/          # API route definitions
│   │   ├── config/          # DB, Cloudinary config
│   │   └── utils/           # Helpers
│   ├── migrations/          # DB schema migrations
│   ├── seeds/               # Dummy seed data
│   └── package.json
│
├── docker/
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Quick Start

### Prerequisites

- Node.js >= 18
- Docker + Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone & Setup Environment

```bash
git clone https://github.com/yourname/tani-hub.git
cd tani-hub

# Backend env
cp backend/.env.example backend/.env

# Frontend env
cp frontend/.env.example frontend/.env
```

### 2. Run with Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

### 3. Run Manually

```bash
# Backend
cd backend
npm install
npm run migrate
npm run seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

---

## 👤 Demo Accounts

| Role   | Email             | Password   |
| ------ | ----------------- | ---------- |
| Admin  | admin@tanihub.id  | Admin123!  |
| Farmer | petani@tanihub.id | Petani123! |
| Buyer  | buyer@tanihub.id  | Buyer123!  |

---

## 📡 API Documentation

### Auth Endpoints

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login & get JWT   |
| GET    | `/api/auth/me`       | Get current user  |

### Product Endpoints

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/products`     | List all products       |
| GET    | `/api/products/:id` | Get product detail      |
| POST   | `/api/products`     | Create product (Farmer) |
| PUT    | `/api/products/:id` | Update product (Farmer) |
| DELETE | `/api/products/:id` | Delete product (Farmer) |

### Category Endpoints

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| GET    | `/api/categories` | List categories         |
| POST   | `/api/categories` | Create category (Admin) |

### User Management (Admin)

| Method | Endpoint                      | Description     |
| ------ | ----------------------------- | --------------- |
| GET    | `/api/admin/users`            | List all users  |
| PUT    | `/api/admin/users/:id/verify` | Verify supplier |
| DELETE | `/api/admin/users/:id`        | Delete user     |

### Transaction Endpoints

| Method | Endpoint                       | Description         |
| ------ | ------------------------------ | ------------------- |
| GET    | `/api/transactions`            | Get my transactions |
| POST   | `/api/transactions`            | Create transaction  |
| PUT    | `/api/transactions/:id/status` | Update status       |

---

## 🎭 Role-Based Access

```
Admin      → Full access, verify suppliers, manage all
Farmer     → Manage own products, view orders
Buyer      → Browse products, create transactions
Public     → Browse products (read-only)
```

---

## 🐳 Docker Services

```yaml
services: frontend  → React app (port 3000)
  backend   → Express API (port 5000)
  postgres  → PostgreSQL 15 (port 5432)
```

---

## 🌱 Database Schema

- **users** — id, name, email, password, role, is_verified, location, phone, avatar
- **categories** — id, name, slug, icon
- **products** — id, name, category_id, farmer_id, price, stock, unit, location, quality, image_url, description
- **transactions** — id, product_id, buyer_id, quantity, total_price, status, notes
- **supplier_ratings** — id, farmer_id, buyer_id, rating, review

---

## 🔮 Future Features (Roadmap)

- [ ] AI Market Price Prediction
- [ ] Harvest Stock Estimation
- [ ] Logistics Integration
- [ ] Real-time Chat
- [ ] Mobile App (React Native)
- [ ] Payment Gateway Integration

---

## 📄 License

MIT © 2026 Tani Hub Team
