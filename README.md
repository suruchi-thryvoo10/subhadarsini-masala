# Subhadarshini Next-Gen FMCG Brand & E-Commerce Platform

Production-ready modern FMCG brand platform and e-commerce experience for **Subhadarshini Spices & Foods**, rebuilt from the ground up with high performance, batch lab-test quality traceability, AI recipe assistance, multi-role admin dashboard, Redis multi-tier caching, and load-balanced Docker architecture.

---

## 🚀 Key Features

1. **Brand Discovery & Visual Storyline**:
   - Redesigned homepage featuring authentic Odia spice visual direction (Deep Earthy Red `#8B261D`, Saffron `#E06D27`, Turmeric `#E5A93C`, Warm Beige `#F5EFEB`, Dark Spice Brown `#2C1810`).
   - Interactive farm-to-table manufacturing timeline: *Raw Material → Quality Inspection → Cleaning → Grinding → Blending → Lab Testing → Packaging → Distribution*.

2. **E-Commerce & Shopping System**:
   - Product catalogue `/products` with search, category filtering, variant size selector, discount calculations, ratings, and price sorting.
   - Dynamic Cart & Wishlist with local storage guest persistence and database synchronization upon user authentication.
   - Multi-step checkout pipeline supporting Razorpay UPI, Cards, NetBanking, and COD.

3. **Digital Quality & Lab Traceability (`/quality`)**:
   - Consumers can enter their package batch number (e.g. `SD2026-SP01` or `SD2026-TURMERIC-05`).
   - Displays real-time NABL lab certificate verification, active curcumin percentage, moisture level, and pathogen test results.

4. **AI Recipe Assistant (`/recipes`)**:
   - Ingredient-matching recipe finder allowing users to input available ingredients and receive authentic Indian culinary suggestions paired with one-click "Shop Ingredients" buttons for Subhadarshini spice blends.

5. **Institutional B2B Wholesale (`/wholesale`) & Dealer Locator (`/dealers`)**:
   - B2B volume enquiry pipeline.
   - Searchable distributor locator filtered by state, city, and pincode with direct Google Maps navigation.

6. **Multi-Role Admin Portal (`/admin`)**:
   - Live revenue metrics, low stock alert tracking, order status fulfillment pipeline (`CONFIRMED` → `PROCESSING` → `PACKED` → `SHIPPED` → `DELIVERED`).
   - Lab test batch certificate issue tool.
   - Administrative Audit Log viewer storing immutable records of configuration and product changes.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Router v6, TanStack Query, React Hook Form, Zod.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose (MongoDB 7), ioredis (Redis 7), JWT authentication, Bcrypt, Zod validation, Helmet security headers, Express Rate Limiter.
- **Infrastructure**: Docker Compose, Nginx reverse proxy load-balancer, 3 stateless backend replicas, Redis cache & token store, MongoDB volume persistence.

---

## 🚦 Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populate default categories, products, lab test batches, dealers, recipes & admin user
npm run dev      # Server starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Vite dev server runs on http://localhost:3000
```

### 3. Docker Compose Stack (Production Cluster)
```bash
docker-compose up --build -d
```

---

## 🔑 Demo Credentials

- **Admin Account**: `admin@subhadarshini.com` / `Admin@123456`
- **Customer Demo Account**: `priyanka@example.com` / `User@123456`
- **Sample Verified Batch Numbers for Traceability**: `SD2026-SP01`, `SD2026-GM04`
