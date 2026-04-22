-- HEXCORE Database Schema
-- Run via: npm run db:init

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(255) NOT NULL UNIQUE,
  category       VARCHAR(100) NOT NULL,
  description    TEXT NOT NULL DEFAULT '',
  price          NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  stock          INTEGER NOT NULL DEFAULT 0,
  rating         NUMERIC(3, 2) NOT NULL DEFAULT 0,
  reviews_count  INTEGER NOT NULL DEFAULT 0,
  image_url      TEXT,
  tags           TEXT[] DEFAULT '{}',
  featured       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_email      VARCHAR(255),
  status           VARCHAR(50) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  total            NUMERIC(10, 2) NOT NULL,
  shipping_name    VARCHAR(255) NOT NULL,
  shipping_email   VARCHAR(255) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city    VARCHAR(100) NOT NULL,
  shipping_country VARCHAR(100) NOT NULL DEFAULT 'Italy',
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name       VARCHAR(255) NOT NULL,
  price      NUMERIC(10, 2) NOT NULL,
  quantity   INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
