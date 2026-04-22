/**
 * Database initializer — creates tables and seeds demo data.
 * Run once: node src/db/init.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })

const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
})

const PRODUCTS = [
  {
    name: 'HX-PRO K1 Mechanical Keyboard',
    category: 'keyboards',
    description:
      'Full-size mechanical keyboard with Cherry MX Red switches. Per-key RGB lighting, PBT double-shot keycaps, anodized aluminum frame, and USB-C detachable cable. N-key rollover, anti-ghosting.',
    price: 149.99,
    original_price: 199.99,
    stock: 47,
    rating: 4.8,
    reviews_count: 312,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn4_RbuAVPtm3hoU8IRRDH5pCYu20_ptlOMg&s',
    tags: ['mechanical', 'RGB', 'Cherry MX', 'aluminum', 'USB-C'],
    featured: true,
  },
  {
    name: 'HX-Edge TKL Wireless',
    category: 'keyboards',
    description:
      'TKL wireless keyboard with 2.4 GHz + Bluetooth 5.0 dual mode. Membrane-tactile hybrid switches, 60-hour battery life, compact tenkeyless layout.',
    price: 89.99,
    original_price: null,
    stock: 35,
    rating: 4.4,
    reviews_count: 156,
    image_url: 'https://m.media-amazon.com/images/I/61meQuPPc-L._AC_UF894,1000_QL80_.jpg',
    tags: ['wireless', 'TKL', 'Bluetooth', 'compact'],
    featured: false,
  },
  {
    name: 'HX-Stream 60% Hotswap',
    category: 'keyboards',
    description:
      'Compact 60% keyboard with hot-swap PCB. Pre-lubed Gateron Yellow linear switches, south-facing per-key RGB, polycarbonate plate, USB-C. Ideal for portability.',
    price: 79.99,
    original_price: 99.99,
    stock: 22,
    rating: 4.6,
    reviews_count: 89,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBm6eilIPGU6lkXUMgsOsGQUlSZtN_KKte8w&s',
    tags: ['60%', 'hot-swap', 'Gateron', 'compact', 'RGB'],
    featured: false,
  },
  {
    name: 'HX-Phantom X Wireless Mouse',
    category: 'mice',
    description:
      'Flagship wireless mouse with PAW3395 26,000 DPI optical sensor. 70-hour battery on 2.4 GHz, 5 programmable buttons, 50M-rated buttons, lightweight 78g shell.',
    price: 79.99,
    original_price: null,
    stock: 60,
    rating: 4.9,
    reviews_count: 445,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaBxj8omFtB04AL9rvuqtfA7264SxqaO8sHw&s',
    tags: ['wireless', 'PAW3395', '26000 DPI', 'lightweight'],
    featured: true,
  },
  {
    name: 'HX-Precision M Pro',
    category: 'mice',
    description:
      'Symmetrical wired mouse with 12,000 DPI optical sensor. Braided USB cable, 6 programmable buttons, ergonomic mid-grip design, 1000 Hz polling rate.',
    price: 59.99,
    original_price: 74.99,
    stock: 80,
    rating: 4.5,
    reviews_count: 203,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbpJSb1rRFdYCiujQsutnw7biso2TwyC0rtA&s',
    tags: ['wired', 'symmetrical', '12000 DPI', 'ergonomic'],
    featured: false,
  },
  {
    name: 'HX-Ultra Gaming Mouse',
    category: 'mice',
    description:
      'Ultra-light gaming mouse at 58g with honeycomb shell and PAW3395 sensor. 36,000 DPI ceiling, 8K polling rate, flexible paracord cable, PTFE glides.',
    price: 99.99,
    original_price: null,
    stock: 40,
    rating: 4.7,
    reviews_count: 178,
    image_url: 'https://i5.walmartimages.com/seo/Logitech-G203-Lightsync-Mose-Black_d28f7772-ee8d-4bac-93ac-a04ef55ba714.96c34343dc0c512d778b31dd5caf5bbe.jpeg',
    tags: ['ultra-light', 'honeycomb', '8K polling', 'PAW3395'],
    featured: false,
  },
  {
    name: 'HX-Soundform Pro Headset',
    category: 'headsets',
    description:
      '50mm neodymium drivers with virtual 7.1 surround sound. Detachable noise-canceling mic, USB + 3.5mm dual connection, memory foam ear cushions, 300g lightweight.',
    price: 129.99,
    original_price: 159.99,
    stock: 55,
    rating: 4.6,
    reviews_count: 267,
    image_url: 'https://m.media-amazon.com/images/I/61RahTQtAqL._AC_UF1000,1000_QL80_.jpg',
    tags: ['7.1 surround', 'detachable mic', 'USB', '3.5mm'],
    featured: true,
  },
  {
    name: 'HX-Studio Monitor Headset',
    category: 'headsets',
    description:
      'Open-back studio headset with 40mm planar magnetic drivers. 10–40,000 Hz response, 32Ω impedance, 3.5mm balanced output, reference-grade accuracy.',
    price: 199.99,
    original_price: null,
    stock: 18,
    rating: 4.8,
    reviews_count: 94,
    image_url: 'https://it.static.webuy.com/product_images/Elettronica/Cuffie%20-%20Apple/SCUFAAPMOEGC_l.jpg',
    tags: ['open-back', 'planar', 'studio', 'reference'],
    featured: false,
  },
  {
    name: 'HX-ViewMax 27" QHD',
    category: 'monitors',
    description:
      '27-inch IPS monitor at 2560×1440 resolution. 165Hz refresh, 1ms GtG, 95% DCI-P3, HDMI 2.1 + DisplayPort 1.4, USB-C 65W, height/tilt/swivel/pivot stand.',
    price: 449.99,
    original_price: 549.99,
    stock: 25,
    rating: 4.7,
    reviews_count: 134,
    image_url: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/aw-series/aw3225qf/pdp/monitor-alienware-aw3225qf-hero.psd?fmt=jpg&wid=756&hei=525',
    tags: ['27"', 'QHD', '165Hz', 'IPS', 'USB-C'],
    featured: true,
  },
  {
    name: 'HX-Vision 32" 4K OLED',
    category: 'monitors',
    description:
      '32-inch OLED display at 3840×2160. 120Hz, 0.1ms, HDR1000, 99% DCI-P3 color accuracy, USB-C 90W PD, 4× USB-A, KVM switch. Pixel-perfect for creative pros.',
    price: 699.99,
    original_price: null,
    stock: 12,
    rating: 4.9,
    reviews_count: 67,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU-EU3urVr0-p0Hk2D-6ngDOubcNZcbNJdfg&s',
    tags: ['32"', '4K', 'OLED', '120Hz', 'HDR1000'],
    featured: false,
  },
  {
    name: 'HX-Link Pro USB-C Hub',
    category: 'hubs',
    description:
      '12-in-1 Thunderbolt 4 hub. Dual 4K HDMI out, 2× TB4 (40 Gbps), 3× USB-A 3.1 (10 Gbps), SD/microSD, 3.5mm, Ethernet, 100W pass-through PD.',
    price: 69.99,
    original_price: null,
    stock: 100,
    rating: 4.5,
    reviews_count: 389,
    image_url: null,
    tags: ['Thunderbolt 4', '12-in-1', '100W PD', 'dual 4K'],
    featured: false,
  },
  {
    name: 'HX-Connect 7-in-1 Hub',
    category: 'hubs',
    description:
      'Compact 7-in-1 USB-C hub. 4K HDMI, 3× USB 3.0, SD + microSD reader, 60W PD charging. Plug & play, no drivers required.',
    price: 49.99,
    original_price: 64.99,
    stock: 150,
    rating: 4.4,
    reviews_count: 512,
    image_url: null,
    tags: ['7-in-1', 'plug & play', '4K HDMI', 'SD reader'],
    featured: false,
  },
  {
    name: 'HX-Cam 4K Pro Webcam',
    category: 'webcams',
    description:
      '4K 30fps webcam with AI auto-framing and auto-exposure. Dual noise-canceling microphones, physical privacy shutter, 90° FOV, works with Teams/Zoom/OBS.',
    price: 119.99,
    original_price: 139.99,
    stock: 70,
    rating: 4.6,
    reviews_count: 223,
    image_url: null,
    tags: ['4K', 'AI auto-frame', 'privacy shutter', 'dual mic'],
    featured: false,
  },
  {
    name: 'HX-Vision Lite Webcam',
    category: 'webcams',
    description:
      '1080p 60fps webcam with fixed-focus lens and built-in mic. Universal clip mount fits monitors and laptops. Plug & play USB-A, zero-config.',
    price: 69.99,
    original_price: null,
    stock: 90,
    rating: 4.3,
    reviews_count: 345,
    image_url: null,
    tags: ['1080p', '60fps', 'plug & play', 'USB-A'],
    featured: false,
  },
  {
    name: 'HX-Desk Mat XL',
    category: 'accessories',
    description:
      '900×400mm extended desk mat. Micro-fiber surface optimized for both high and low DPI. Anti-slip rubber base, stitched edges, spill-resistant coating.',
    price: 34.99,
    original_price: null,
    stock: 200,
    rating: 4.7,
    reviews_count: 678,
    image_url: null,
    tags: ['XL', 'anti-slip', 'stitched edges', '900x400'],
    featured: false,
  },
  {
    name: 'HX-Stand Pro Laptop Stand',
    category: 'accessories',
    description:
      'Premium aluminum laptop stand for 10–17" laptops. 6 adjustable height angles, built-in cable management channel, foldable for travel, anti-scratch silicone pads.',
    price: 59.99,
    original_price: 74.99,
    stock: 85,
    rating: 4.6,
    reviews_count: 198,
    image_url: null,
    tags: ['aluminum', 'adjustable', 'foldable', 'cable management'],
    featured: false,
  },
]

async function init() {
  const client = await pool.connect()
  try {
    console.log('Initializing HEXCORE database...')

    // Run schema
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
    await client.query(schema)
    console.log('✓ Schema applied')

    // Seed admin user
    const adminHash = await bcrypt.hash('Admin@2025', 12)
    await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@hexcore.tech', adminHash, 'Alex', 'Morgan', 'admin']
    )

    // Seed demo user
    const userHash = await bcrypt.hash('User@2025', 12)
    await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['user@hexcore.tech', userHash, 'Jordan', 'Smith', 'user']
    )
    console.log('✓ Demo users seeded')

    // Seed products
    for (const p of PRODUCTS) {
      await client.query(
        `INSERT INTO products
           (name, category, description, price, original_price, stock, rating, reviews_count, tags, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT DO NOTHING`,
        [
          p.name,
          p.category,
          p.description,
          p.price,
          p.original_price || null,
          p.stock,
          p.rating,
          p.reviews_count,
          p.tags,
          p.featured,
        ]
      )
    }
    console.log(`✓ ${PRODUCTS.length} products seeded`)
    console.log('\nDatabase initialization complete!')
    console.log('Admin: admin@hexcore.tech / Admin@2025')
    console.log('User:  user@hexcore.tech  / User@2025')
  } catch (err) {
    console.error('Init failed:', err)
    throw err
  } finally {
    client.release()
  }
}

// Allow both direct execution (node src/db/init.js) and require()
async function initDatabase() {
  const client = await pool.connect()
  try {
    console.log('Initializing HEXCORE database...')
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
    await client.query(schema)
    console.log('✓ Schema applied')

    const adminHash = await bcrypt.hash('Admin@2025', 12)
    await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@hexcore.tech', adminHash, 'Alex', 'Morgan', 'admin']
    )

    const userHash = await bcrypt.hash('User@2025', 12)
    await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['user@hexcore.tech', userHash, 'Jordan', 'Smith', 'user']
    )
    console.log('✓ Demo users seeded')

    for (const p of PRODUCTS) {
      await client.query(
        `INSERT INTO products
           (name, category, description, price, original_price, stock, rating, reviews_count, image_url, tags, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url`,
        [
          p.name,
          p.category,
          p.description,
          p.price,
          p.original_price || null,
          p.stock,
          p.rating,
          p.reviews_count,
          p.image_url || null,
          p.tags,
          p.featured,
        ]
      )
    }
    console.log(`✓ ${PRODUCTS.length} products seeded`)
    console.log('Database initialization complete!')
  } catch (err) {
    console.error('Init failed:', err)
    throw err
  } finally {
    client.release()
  }
}

module.exports = { initDatabase }

// Direct execution: node src/db/init.js
if (require.main === module) {
  initDatabase().then(() => pool.end()).catch(() => process.exit(1))
}
