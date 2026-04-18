# ⚙️ ShopHub – Backend

Backend API for the ShopHub e-commerce platform built with Node.js, Express, MongoDB, and Stripe. Provides REST APIs for authentication, products, orders, payments, contact, and newsletter.

---

## 🔗 Links

* 🌐 **API Base URL:**
  https://ecommerce-backend-production-fe81.up.railway.app

* 🐙 **GitHub:**
  https://github.com/MuhammadShoaib20/Ecommerce-backend

---

## ✨ Features

* 🔐 JWT Authentication
* 🛍️ Product CRUD (Admin)
* 📦 Order management
* 💳 Stripe payments + webhook
* 📞 Contact system
* 📧 Newsletter system
* 🛡️ Role-based authorization
* ☁️ Cloudinary image upload (optional)

---

## 🛠️ Tech Stack

| Technology         | Purpose       |
| ------------------ | ------------- |
| Node.js + Express  | Backend       |
| MongoDB + Mongoose | Database      |
| JWT + bcrypt       | Auth          |
| Stripe             | Payments      |
| Cloudinary         | Image hosting |
| Nodemailer         | Email         |

---

## 📁 Project Structure

```bash
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── scripts/
├── server.js
├── .env.example
└── package.json
```

---

## ⚙️ Installation

```bash
git clone https://github.com/MuhammadShoaib20/Ecommerce-backend.git
cd Ecommerce-backend
npm install
```

---

## 🔧 Environment Variables

Create `.env`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/shophub

JWT_SECRET=your_secret
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🌱 Seed Data

```bash
npm run seed
```

Creates:

* Admin user
* Sample products

---

## ▶️ Run Server

```bash
npm run dev
npm start
```

Runs on: **http://localhost:5000**

---

## 📡 API Overview

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/auth/profile`

### Products

* GET `/api/products`
* GET `/api/product/:id`
* POST `/api/admin/product/new`

### Orders

* POST `/api/order/new`
* GET `/api/orders/me`

### Payment

* POST `/api/payment/process`
* GET `/api/stripeapikey`

### Contact

* POST `/api/contact`

### Newsletter

* POST `/api/newsletter/subscribe`

---

## 🧪 Stripe Testing

| Card                | Result  |
| ------------------- | ------- |
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Failed  |

---

## 🚀 Deployment (Railway)

1. Push to GitHub
2. Connect repo in Railway
3. Add env variables
4. Start command: `npm start`

---

## 📄 License

MIT License

---

<div align="center">
❤️ Built by Muhammad Shoaib
</div>
