const express = require('express')
const { body, validationResult } = require('express-validator')
const pool = require('../db')
const { requireAuth, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// GET /api/products — public list with optional filters
router.get('/', async (req, res) => {
  const { category, search, featured, limit = 100, offset = 0 } = req.query
  try {
    const conditions = []
    const params = []

    if (category && category !== 'all') {
      params.push(category)
      conditions.push(`category = $${params.length}`)
    }
    if (featured === 'true') {
      conditions.push('featured = TRUE')
    }
    if (search) {
      params.push(`%${search.toLowerCase()}%`)
      conditions.push(
        `(LOWER(name) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(category) LIKE $${params.length})`
      )
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const sql = `
      SELECT * FROM products
      ${where}
      ORDER BY featured DESC, created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `

    const result = await pool.query(sql, params)
    res.json({ products: result.rows, total: result.rowCount })
  } catch (err) {
    console.error('Products list error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/products/:id — single product
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error('Product get error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

const productValidators = [
  body('name').trim().isLength({ min: 2, max: 255 }),
  body('category').trim().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 10 }),
  body('price').isFloat({ min: 0.01 }),
  body('stock').isInt({ min: 0 }),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
  body('reviews_count').optional().isInt({ min: 0 }),
  body('featured').optional().isBoolean(),
]

// POST /api/products — admin only
router.post('/', requireAuth, requireAdmin, productValidators, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { name, category, description, price, original_price, stock, rating, reviews_count, image_url, tags, featured } =
    req.body
  try {
    const result = await pool.query(
      `INSERT INTO products
         (name, category, description, price, original_price, stock, rating, reviews_count, image_url, tags, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        name,
        category,
        description,
        price,
        original_price || null,
        stock,
        rating || 0,
        reviews_count || 0,
        image_url || null,
        tags || [],
        featured || false,
      ]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Product create error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/products/:id — admin only
router.put('/:id', requireAuth, requireAdmin, productValidators, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { name, category, description, price, original_price, stock, rating, reviews_count, image_url, tags, featured } =
    req.body
  try {
    const result = await pool.query(
      `UPDATE products SET
         name=$1, category=$2, description=$3, price=$4, original_price=$5,
         stock=$6, rating=$7, reviews_count=$8, image_url=$9, tags=$10,
         featured=$11, updated_at=NOW()
       WHERE id=$12
       RETURNING *`,
      [
        name,
        category,
        description,
        price,
        original_price || null,
        stock,
        rating || 0,
        reviews_count || 0,
        image_url || null,
        tags || [],
        featured || false,
        req.params.id,
      ]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error('Product update error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/products/:id — admin only
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
    res.json({ message: 'Product deleted', id: req.params.id })
  } catch (err) {
    console.error('Product delete error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
