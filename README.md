# HEXCORE — Precision Tech Accessories

> A production-ready full-stack e-commerce platform for tech accessories, built with React/Vite (Tailwind v4), Node.js/Express, and PostgreSQL.

---

## Project Structure

```
Tournament/          ← Git root
├── frontend/        ← React + Vite app (deploy to Vercel)
└── backend/         ← Node.js API + Docker (deploy to Railway)
```

---

## Local Development

### Prerequisites
- Node.js 20+
- Docker (optional, for backend)
- PostgreSQL 15+ (or use Railway)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env

npm install
npm run db:init   # Creates tables + seeds demo data
npm run dev       # Starts on http://localhost:4000
```

**Demo credentials (seeded automatically):**
| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@hexcore.tech     | Admin@2025  |
| User  | user@hexcore.tech      | User@2025   |

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:4000/api

npm install
npm run dev       # Starts on http://localhost:5173
```

> **Offline mode:** If `VITE_API_URL` is not set or the backend is unavailable, the app falls back to built-in mock data and simulates auth via localStorage. Fully functional without a backend.

---

## Deployment

### Frontend → Vercel

1. Connect the `Tournament` repo to Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Add environment variable: `VITE_API_URL=https://your-backend.railway.app/api`

Or use the included `vercel.json` at the root for monorepo routing.

### Backend → Railway

1. Connect the `Tournament` repo to Railway.
2. Set **Root Directory** to `backend`.
3. Railway auto-detects the `Dockerfile`.
4. Add a **PostgreSQL** plugin — Railway injects `DATABASE_URL` automatically.
5. Add environment variables: `JWT_SECRET`, `FRONTEND_URL`.
6. Run `npm run db:init` once via Railway's shell after first deploy.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite 5, Tailwind CSS v4  |
| Animations | Framer Motion                       |
| State      | React Context + useReducer          |
| Persistence| localStorage                        |
| Backend    | Node.js, Express 4                  |
| Auth       | JWT (jsonwebtoken) + bcryptjs       |
| Database   | PostgreSQL 15                       |
| Container  | Docker (multi-stage)                |
| Deploy FE  | Vercel                              |
| Deploy BE  | Railway                             |

---

## API Routes

| Method | Path                  | Auth     | Description            |
|--------|-----------------------|----------|------------------------|
| POST   | /api/auth/login       | —        | Login                  |
| POST   | /api/auth/register    | —        | Register               |
| GET    | /api/auth/me          | Bearer   | Current user           |
| GET    | /api/products         | —        | List products          |
| GET    | /api/products/:id     | —        | Product detail         |
| POST   | /api/products         | Admin    | Create product         |
| PUT    | /api/products/:id     | Admin    | Update product         |
| DELETE | /api/products/:id     | Admin    | Delete product         |
| POST   | /api/orders           | Bearer   | Place order            |
| GET    | /api/orders           | Admin    | List all orders        |
| GET    | /api/orders/mine      | Bearer   | User's own orders      |

---

## Design System

**Brand:** HEXCORE — "Precision Tech. Engineered for Performance."

| Token         | Value     | Usage                     |
|---------------|-----------|---------------------------|
| hx-bg         | #07090F   | Page background           |
| hx-surface    | #0D1117   | Header, footer, sidebar   |
| hx-card       | #161B27   | Product cards             |
| hx-border     | #1E2D3D   | Borders                   |
| hx-accent     | #00C6FF   | Cyan — links, chips, focus|
| hx-orange     | #FF6B35   | CTA buttons (Add to Cart) |
| hx-purple     | #7C3AED   | Admin badge               |
| hx-text       | #E2E8F0   | Primary text              |
| hx-muted      | #64748B   | Secondary text            |

**Fonts:** Space Grotesk (headings) + Inter (body)
