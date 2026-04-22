import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import ProductThumbnail from './ProductThumbnail.jsx'
import ProductDetail from './ProductDetail.jsx'
import { CATEGORY_STYLE } from '../data/mockProducts.js'

function StarRating({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <svg className="w-3 h-3 text-hx-warning fill-hx-warning" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-hx-muted text-[11px]">{rating.toFixed(1)}</span>
    </span>
  )
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { addToast } = useToast()
  const [detailOpen, setDetailOpen] = useState(false)
  const [adding, setAdding] = useState(false)

  const style = CATEGORY_STYLE[product.category] || CATEGORY_STYLE.accessories
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  const handleAddToCart = (e) => {
    e.stopPropagation()
    setAdding(true)
    addItem(product, 1)
    addToast(`${product.name} added to cart`, 'success')
    setTimeout(() => setAdding(false), 600)
  }

  return (
    <>
      <article
        onClick={() => setDetailOpen(true)}
        className="bg-hx-card border border-hx-border rounded-2xl overflow-hidden product-card cursor-pointer flex flex-col"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setDetailOpen(true)}
        aria-label={`${product.name} — $${product.price}`}
      >
        {/* Product image area */}
        <div className="relative aspect-[4/3]">
          <ProductThumbnail
            category={product.category}
            style={style}
            imageUrl={product.image_url}
            alt={product.name}
          />

          {/* Top-right badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            {discount && (
              <span className="badge bg-hx-orange text-white text-[10px]">
                -{discount}%
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="badge bg-hx-warning/20 text-hx-warning border border-hx-warning/30 text-[10px]">
                Low Stock
              </span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-hx-error/20 text-hx-error border border-hx-error/30 text-[10px]">
                Sold Out
              </span>
            )}
          </div>

          {/* Category label bottom-left */}
          <div className="absolute bottom-3 left-3">
            <span
              className="badge text-[10px] border"
              style={{
                background: `${style.accent}22`,
                color: style.accent,
                borderColor: `${style.accent}44`,
              }}
            >
              {product.category}
            </span>
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Name */}
          <h3
            className="text-hx-text font-semibold text-[13.5px] leading-snug line-clamp-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h3>

          {/* Rating row */}
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-hx-muted text-[11px]">({product.reviews_count})</span>
          </div>

          {/* Price row */}
          <div className="flex items-baseline gap-2 mt-auto">
            <span
              className="text-hx-text font-bold text-base"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && (
              <span className="text-hx-muted text-xs line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className={clsx(
              'btn-primary w-full text-[13px] py-2 mt-1 relative overflow-hidden',
              (product.stock === 0) && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {adding ? (
                <motion.span
                  key="adding"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </article>

      {/* Product detail modal */}
      <ProductDetail
        product={product}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        style={style}
      />
    </>
  )
}
