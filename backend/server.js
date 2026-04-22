require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./src/routes/auth')
const productRoutes = require('./src/routes/products')
const orderRoutes = require('./src/routes/orders')
const { initDatabase } = require('./src/db/init')

const app = express()
const PORT = process.env.PORT || 4000

// Trust Railway / Vercel reverse proxy so rate-limit reads the real client IP
app.set('trust proxy', 1)

// ── Security middleware ────────────────────────────────────────────
app.use(helmet())

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://tournament-lol.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// General rate limit
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  })
)

// Tighter limit on auth routes
app.use(
  '/api/auth/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many login attempts, try again later.' },
  })
)

app.use(express.json({ limit: '10kb' }))

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'hexcore-api', timestamp: new Date().toISOString() })
})

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

async function start() {
  await initDatabase()
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HEXCORE API running on port ${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
