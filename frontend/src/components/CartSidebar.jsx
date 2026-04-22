import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { CATEGORY_STYLE } from '../data/mockProducts.js'

function CartItemRow({ item, onRemove, onUpdateQty }) {
  const style = CATEGORY_STYLE[item.product.category] || CATEGORY_STYLE.accessories

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 p-3 rounded-xl bg-hx-card border border-hx-border"
    >
      {/* Mini thumbnail */}
      <div
        className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${style.gradFrom}, ${style.gradTo})` }}
      >
        <span
          className="text-2xl"
          style={{ filter: `drop-shadow(0 0 6px ${style.accent}88)` }}
          aria-hidden="true"
        />
        <svg width="32" height="32" viewBox="0 0 72 72" fill="none" aria-hidden="true" style={{ color: style.accent }}>
          <circle cx="36" cy="36" r="20" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
          <circle cx="36" cy="36" r="10" fill="currentColor" opacity="0.3"/>
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-hx-text text-xs font-semibold leading-snug line-clamp-2 mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {item.product.name}
        </p>
        <p className="text-hx-muted text-[11px]">${item.product.price.toFixed(2)} each</p>

        {/* Qty controls */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-hx-border rounded-lg overflow-hidden">
            <button
              onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
              className="px-2 py-1 text-hx-muted hover:text-hx-text hover:bg-white/5 transition-colors text-xs"
              aria-label="Decrease quantity"
            >−</button>
            <span className="w-7 text-center text-hx-text text-xs py-1">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              className="px-2 py-1 text-hx-muted hover:text-hx-text hover:bg-white/5 transition-colors text-xs disabled:opacity-40"
              aria-label="Increase quantity"
            >+</button>
          </div>

          <span className="text-hx-text text-xs font-semibold ml-auto">
            ${(item.product.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.product.id)}
        className="text-hx-muted hover:text-hx-error transition-colors p-1 self-start"
        aria-label={`Remove ${item.product.name}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </motion.div>
  )
}

export default function CartSidebar({ open, onClose, onCheckout }) {
  const { items, totalItems, totalPrice, removeItem, updateQty, clearCart } = useCart()
  const { addToast } = useToast()

  const handleClear = () => {
    clearCart()
    addToast('Cart cleared', 'info')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar panel */}
          <motion.aside
            className="fixed top-0 right-0 bottom-0 z-[81] w-full max-w-md bg-hx-surface border-l border-hx-border flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-hx-border">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-hx-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 21a1 1 0 11-2 0 1 1 0 012 0zm9 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <h2
                  className="text-hx-text font-bold text-base"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="badge bg-hx-accent/20 text-hx-accent border border-hx-accent/30">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {items.length > 0 && (
                  <button onClick={handleClear} className="btn-ghost text-xs text-hx-error hover:bg-red-950/30">
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-hx-muted hover:text-hx-text hover:bg-white/5 transition-colors"
                  aria-label="Close cart"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <svg className="w-16 h-16 text-hx-border mb-4" fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 10h8l5.5 28h22l4.5-18H18" />
                    <circle cx="26" cy="52" r="3" /><circle cx="44" cy="52" r="3" />
                  </svg>
                  <p className="text-hx-muted text-sm">Your cart is empty</p>
                  <button onClick={onClose} className="btn-secondary mt-4 text-xs">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartItemRow
                      key={item.product.id}
                      item={item}
                      onRemove={removeItem}
                      onUpdateQty={updateQty}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer summary */}
            {items.length > 0 && (
              <div className="border-t border-hx-border p-5 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-hx-muted">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-hx-muted">
                    <span>Shipping</span>
                    <span className="text-hx-green">Free</span>
                  </div>
                  <div className="h-px bg-hx-border my-2" />
                  <div className="flex justify-between text-hx-text font-bold text-base">
                    <span>Total</span>
                    <span style={{ fontFamily: 'var(--font-display)' }}>
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button onClick={onCheckout} className="btn-primary w-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Proceed to Checkout
                </button>
                <button onClick={onClose} className="btn-ghost w-full text-sm">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
