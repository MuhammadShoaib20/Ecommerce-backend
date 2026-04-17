# ShopHub Backend

Backend API for the ShopHub e-commerce platform. Built with Node.js, Express, MongoDB, and Stripe — providing RESTful endpoints for user authentication, product management, order processing, payments, contact forms, and newsletter subscriptions.

---

## 🚀 Live API

| | |
|---|---|
| **Base URL** | https://ecommerce-shophub-85lk.onrender.com |
| **API Root** | `/api` |

---

## ✨ Features

- 🔐 **User Authentication** — JWT-based registration, login, profile management, password change
- 🛍️ **Product Management** — CRUD operations (admin only), reviews, search/filter/pagination
- 📦 **Order Management** — Create orders, view user orders, update status (admin), stock management
- 💳 **Payments** — Stripe integration (PaymentIntents) with mock fallback mode; webhook support
- 📞 **Contact & Newsletter** — Public contact form, newsletter subscribe/unsubscribe, admin panel
- 🛡️ **Role-Based Access** — Admin routes protected by `authorizeRoles` middleware
- ☁️ **Cloudinary** — Optional image uploads with Base64 fallback

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express.js | Backend framework |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Stripe | Payment processing (optional) |
| Cloudinary | Image hosting (optional) |
| Nodemailer | Email support (optional) |
| dotenv | Environment variable management |

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── cloudinary.js        # Cloudinary configuration
│   └── db.js                # MongoDB connection
├── controllers/             # Route handlers
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── newsletterController.js
│   └── contactController.js
├── middleware/
│   └── auth.js              # JWT verification & role authorization
├── models/                  # Mongoose models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Newsletter.js
│   └── Contact.js
├── routes/                  # Express routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── newsletterRoutes.js
│   └── contactRoutes.js
├── scripts/
│   └── seedProducts.js      # Script to populate sample data
├── server.js                # Entry point
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/MuhammadShoaib20/Ecommerce-ShopHub.git
cd Ecommerce-ShopHub/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `backend/` folder based on `.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/shophub   # or MongoDB Atlas connection string

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,https://ecommerce-shop-hub-pied.vercel.app

# Dev routes (for local testing only)
ENABLE_DEV_ROUTES=true   # Set to false in production
```

### 4. Seed sample data (optional)

```bash
npm run seed
```

Creates an admin user (`admin@shophub.com` / `admin123`) and populates the database with 19 sample products.

### 5. Start the server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

---

## 📌 API Endpoints

All endpoints are prefixed with `/api`.

### Auth — `/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login and receive JWT | Public |
| GET | `/logout` | Logout (clears token) | Private |
| GET | `/profile` | Get logged-in user profile | Private |
| PUT | `/profile/update` | Update name or email | Private |
| PUT | `/password/update` | Change password | Private |

> **Dev Route:** `POST /auth/dev-token` — returns a JWT for a given email (requires `ENABLE_DEV_ROUTES=true`)

---

### Products — `/products`, `/admin/products`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/products` | Get all products (with filters) | Public |
| GET | `/product/:id` | Get single product details | Public |
| POST | `/admin/product/new` | Create a new product | Admin only |
| GET | `/admin/products` | Get all products (admin view) | Admin only |
| PUT | `/admin/product/:id` | Update a product | Admin only |
| DELETE | `/admin/product/:id` | Delete a product | Admin only |
| PUT | `/review` | Add or update a review | Private |
| GET | `/reviews` | Get reviews for a product | Public |
| DELETE | `/admin/review` | Delete a review | Admin only |

---

### Orders — `/order`, `/admin/orders`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/order/new` | Create a new order | Private |
| GET | `/order/:id` | Get single order details | Private |
| GET | `/orders/me` | Get current user's orders | Private |
| GET | `/admin/orders` | Get all orders | Admin only |
| PUT | `/admin/order/:id` | Update order status | Admin only |
| DELETE | `/admin/order/:id` | Delete an order | Admin only |

---

### Payment — `/payment`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/payment/process` | Create a Stripe PaymentIntent (or mock) | Private |
| GET | `/stripeapikey` | Return Stripe publishable key | Private |
| POST | `/payment/webhook` | Stripe webhook handler | Public |
| POST | `/payment/process-debug` | Process without auth (dev only) | Dev |

---

### Newsletter — `/newsletter`, `/admin/newsletter`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/newsletter/subscribe` | Subscribe an email | Public |
| POST | `/newsletter/unsubscribe` | Unsubscribe an email | Public |
| GET | `/admin/newsletter/subscribers` | Get all active subscribers | Admin only |
| DELETE | `/admin/subscription/:id` | Delete a subscription | Admin only |

---

### Contact — `/contact`, `/admin/contacts`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/contact` | Submit a contact message | Public |
| GET | `/admin/contacts` | Get all contact messages | Admin only |
| DELETE | `/admin/contact/:id` | Delete a contact message | Admin only |

---

## 🧪 Stripe Payments Testing

### Mock Mode (no Stripe key)

If `STRIPE_SECRET_KEY` is not set or is invalid, `/payment/process` returns a mocked `client_secret`. The frontend can use this to simulate a successful payment without connecting to Stripe.

### Test Cards (real mode)

| Card Number | Result |
|---|---|
| `4242 4242 4242 4242` | Success (Visa) |
| `4000 0000 0000 0002` | Declined |

Use any future expiry date and any CVC.

### Local Webhook Testing

```bash
# 1. Install the Stripe CLI

# 2. Forward events to your local server
stripe listen --forward-to localhost:5000/api/payment/webhook

# 3. Copy the signing secret (whsec_...) into your .env as STRIPE_WEBHOOK_SECRET

# 4. Trigger a test event
stripe trigger payment_intent.succeeded
```

---

## 🚢 Deployment

This backend is designed for platforms like Render, Railway, or Heroku.

### Required Environment Variables for Production

| Variable | Description |
|---|---|
| `PORT` | Usually assigned by the platform |
| `NODE_ENV` | Set to `production` |
| `MONGODB_URI` | Production MongoDB connection string (e.g., Atlas) |
| `JWT_SECRET` | A strong, random secret |
| `FRONTEND_URL` | Your deployed frontend URL |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins |
| `STRIPE_SECRET_KEY` | For live payments (optional) |
| `STRIPE_PUBLISHABLE_KEY` | For live payments (optional) |
| `CLOUDINARY_*` | For image uploads (optional) |

### Start Command

```bash
npm start
```

No build step required.

---

## 📄 License

MIT License

## 👨‍💻 Author

**Muhammad Shoaib**  
GitHub: [Ecommerce-ShopHub](https://github.com/MuhammadShoaib20/Ecommerce-ShopHub)