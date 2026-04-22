# HEXCORE — Extras vs. Requirements

## Required ✓ (all done)
- Product catalog with photo, title, descriptions, price, quantity
- Cart: add / edit quantity / remove / simulated purchase
- Admin area with login, product list, add / edit / delete
- Responsive layout, dynamic DOM, localStorage persistence

## Extra features delivered

**Tech stack (required: vanilla JS/HTML/CSS)**
- React 19 + Vite 8, Tailwind CSS v4, Framer Motion animations
- Node.js + Express REST API with JWT authentication
- PostgreSQL database on Railway (real persistence, not just localStorage)
- Deployed live: Vercel (frontend) + Railway (backend)

**Auth**
- Real JWT login/register with bcrypt password hashing
- Two roles enforced server-side (`user` / `admin`)
- Protected `/admin` route redirects non-admins

**Products**
- 16 seeded products across 7 categories with real product photos
- Search bar + category filter chips + result count
- Featured products highlighted in hero section

**Cart**
- Slide-in sidebar with spring animation
- Stock-capped quantities (can't exceed available stock)
- Cart persisted to localStorage across page reloads

**Checkout**
- 4-step flow: Review → Shipping → Payment → Confirmation
- Form validation on every step
- Order saved to DB (or simulated offline with generated order ID)

**Admin panel**
- Stats cards (total / in-stock / featured / low-stock counts)
- Search + category filter on product table
- Color-coded stock status (green / yellow / red)
- Delete confirmation modal
- Inline create/edit modal with toggle for "featured"

**Security (beyond requirements)**
- Helmet.js security headers
- Rate limiting (200 req/15 min general, 20 for auth)
- Input validation with express-validator
- CORS locked to frontend URL
- Non-root Docker user

**UX / Design**
- Dark premium "HEXCORE" brand with custom design tokens
- Toast notifications (success / error / info)
- Loading skeleton grid while fetching
- Image fallback to SVG category icon on broken URL
- Offline mode: falls back to mock data when backend is unreachable
