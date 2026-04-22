import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import ProductThumbnail from './ProductThumbnail.jsx'

function StarRow({ rating, count }) {
  const full = Math.floor(rating)
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < full ? 'fill-hx-warning text-hx-warning' : 'text-hx-border fill-hx-border'}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-hx-muted text-xs">{rating.toFixed(1)} ({count} reviews)</span>
    </div>
  )
}

export default function ProductDetail({ product, open, onClose, style }) {
  const { addItem } = useCart()
  const { addToast } = useToast()
  const [qty, setQty] = useState(1)

  if (!product) return null

  const handleAdd = () => {
    addItem(product, qty)
    addToast(`${product.name} ×${qty} added to cart`, 'success')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[91] flex items-end sm:items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto bg-hx-surface border border-hx-border rounded-2xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto"
              initial={{ scale: 0.96, y: 24 }}
              animate={{ scale: 1,    y: 0  }}
              exit={{    scale: 0.96, y: 24 }}
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            >
              {/* Close */}
              <div className="flex justify-between items-center p-4 border-b border-hx-border sticky top-0 bg-hx-surface z-10">
                <span
                  className="text-xs font-bold uppercase tracking-widest text-hx-muted"
                  style={{ color: style?.accent }}
                >
                  {product.category}
                </span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-hx-muted hover:text-hx-text hover:bg-white/5 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-0">
                {/* Image */}
                <div className="aspect-square sm:aspect-auto sm:h-72">
                  <ProductThumbnail
                    category={product.category}
                    style={style}
                    imageUrl={product.image_url}
                    alt={product.name}
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-4">
                  <h2
                    className="text-hx-text text-lg font-bold leading-snug"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {product.name}
                  </h2>

                  <StarRow rating={product.rating} count={product.reviews_count} />

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-2xl font-bold text-hx-text"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      ${product.price.toFixed(2)}
                    </span>
                    {product.original_price && (
                      <>
                        <span className="text-hx-muted text-sm line-through">
                          ${product.original_price.toFixed(2)}
                        </span>
                        <span className="badge bg-hx-orange text-white text-[10px]">
                          -{Math.round((1 - product.price / product.original_price) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stock */}
                  <p className="text-xs text-hx-muted">
                    {product.stock > 10
                      ? <span className="text-hx-green">✓ In stock ({product.stock} units)</span>
                      : product.stock > 0
                      ? <span className="text-hx-warning">⚠ Only {product.stock} left</span>
                      : <span className="text-hx-error">✗ Out of stock</span>
                    }
                  </p>

                  {/* Qty selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-hx-muted text-sm">Qty:</span>
                    <div className="flex items-center border border-hx-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="px-3 py-2 text-hx-muted hover:text-hx-text hover:bg-white/5 transition-colors"
                        disabled={qty <= 1}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-10 text-center text-hx-text text-sm font-medium py-2">{qty}</span>
                      <button
                        onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                        className="px-3 py-2 text-hx-muted hover:text-hx-text hover:bg-white/5 transition-colors"
                        disabled={qty >= product.stock}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={product.stock === 0}
                    className="btn-primary w-full mt-auto"
                  >
                    Add {qty} to Cart — ${(product.price * qty).toFixed(2)}
                  </button>
                </div>
              </div>

              {/* Description + tags */}
              <div className="px-5 pb-6 border-t border-hx-border pt-5">
                <h3 className="text-hx-muted text-xs font-semibold uppercase tracking-wider mb-2">About this product</h3>
                <p className="text-hx-muted text-sm leading-relaxed">{product.description}</p>
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-hx-muted border border-hx-border rounded-full px-2.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
