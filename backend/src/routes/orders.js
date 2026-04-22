const express = require('express')
const { body, validationResult } = require('express-validator')
const pool = require('../db')
const { requireAuth, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// POST /api/orders — place order (authenticated or guest)
router.post(
  '/',
  requireAuth,
  [
    body('items').isArray({ min: 1 }),
    body('items.*.productId').notEmpty(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('shippingName').trim().isLength({ min: 2 }),
    body('shippingEmail').isEmail().normalizeEmail(),
    body('shippingAddress').trim().isLength({ min: 5 }),
    body('shippingCity').trim().isLength({ min: 2 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { items, shippingName, shippingEmail, shippingAddress, shippingCity, shippingCountry, notes } =
      req.body

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Verify products and calculate total
      let total = 0
      const enrichedItems = []

      for (const item of items) {
        const pResult = await client.query(
          'SELECT id, name, price, stock FROM products WHERE id = $1',
          [item.productId]
        )
        const product = pResult.rows[0]
        if (!product) {
          await client.query('ROLLBACK')
          return res.status(400).json({ error: `Product ${item.productId} not found` })
        }
        if (product.stock < item.quantity) {
          await client.query('ROLLBACK')
          return res.status(400).json({ error: `Insufficient stock for: ${product.name}` })
        }
        total += parseFloat(product.price) * item.quantity
        enrichedItems.push({ ...item, name: product.name, price: product.price })
      }

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders
           (user_id, status, total, shipping_name, shipping_email, shipping_address, shipping_city, shipping_country, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING id, status, total, created_at`,
        [
          req.user.id,
          'confirmed',
          total.toFixed(2),
          shippingName,
          shippingEmail,
          shippingAddress,
          shippingCity,
          shippingCountry || 'Italy',
          notes || null,
        ]
      )
      const order = orderResult.rows[0]

      // Insert order items and reduce stock
      for (const item of enrichedItems) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, name, price, quantity)
           VALUES ($1, $2, $3, $4, $5)`,
          [order.id, item.productId, item.name, item.price, item.quantity]
        )
        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.productId]
        )
      }

      await client.query('COMMIT')

      res.status(201).json({
        orderId: order.id,
        status: order.status,
        total: order.total,
        createdAt: order.created_at,
        items: enrichedItems,
      })
    } catch (err) {
      await client.query('ROLLBACK')
      console.error('Order create error:', err)
      res.status(500).json({ error: 'Failed to place order' })
    } finally {
      client.release()
    }
  }
)

// GET /api/orders/mine — user's own orders
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.id, o.status, o.total, o.created_at,
              json_agg(json_build_object('name', oi.name, 'quantity', oi.quantity, 'price', oi.price)) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Orders mine error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/orders — admin: all orders
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.id, o.status, o.total, o.shipping_name, o.shipping_email, o.created_at,
              u.email AS user_email,
              json_agg(json_build_object('name', oi.name, 'quantity', oi.quantity, 'price', oi.price)) AS items
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       JOIN order_items oi ON oi.order_id = o.id
       GROUP BY o.id, u.email
       ORDER BY o.created_at DESC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Orders admin list error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
