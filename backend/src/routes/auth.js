const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const pool = require('../db')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid email or password format' })
    }

    const { email, password } = req.body
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
      const user = result.rows[0]

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const match = await bcrypt.compare(password, user.password_hash)
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '7d').trim().replace(/^"|"$/g, '') }
      )

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
      })
    } catch (err) {
      console.error('Login error:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[A-Z])(?=.*[0-9])/)
      .withMessage('Password must be 8+ chars with uppercase and number'),
    body('firstName').trim().isLength({ min: 1, max: 100 }),
    body('lastName').trim().isLength({ min: 1, max: 100 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, firstName, lastName } = req.body
    try {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Email already in use' })
      }

      const hash = await bcrypt.hash(password, 12)
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, 'user')
         RETURNING id, email, first_name, last_name, role`,
        [email, hash, firstName, lastName]
      )
      const user = result.rows[0]

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '7d').trim().replace(/^"|"$/g, '') }
      )

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
      })
    } catch (err) {
      console.error('Register error:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
      [req.user.id]
    )
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found' })
    }
    const u = result.rows[0]
    res.json({
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      role: u.role,
    })
  } catch (err) {
    console.error('Me error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
