import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import api from '../utils/api.js'

const STEPS = ['Review', 'Shipping', 'Payment', 'Confirmed']

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-1 px-6 pt-4 pb-2">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1 flex-1">
          <div className={clsx(
            'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all',
            i < current  ? 'bg-hx-accent text-hx-bg'   :
            i === current ? 'bg-hx-accent text-hx-bg ring-2 ring-hx-accent/30' :
                            'bg-hx-card border border-hx-border text-hx-muted'
          )}>
            {i < current
              ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              : i + 1
            }
          </div>
          <span className={clsx('text-[10px] font-medium hidden sm:block whitespace-nowrap', i === current ? 'text-hx-text' : 'text-hx-muted')}>
            {s}
          </span>
          {i < STEPS.length - 1 && (
            <div className={clsx('h-px flex-1 mx-1', i < current ? 'bg-hx-accent' : 'bg-hx-border')} />
          )}
        </div>
      ))}
    </div>
  )
}

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-hx-muted mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-hx-error text-[11px] mt-1">{error}</p>}
    </div>
  )
}

export default function CheckoutModal({ open, onClose }) {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { addToast } = useToast()

  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [errors, setErrors]   = useState({})

  const [shipping, setShipping] = useState({
    name:    user ? `${user.firstName} ${user.lastName}` : '',
    email:   user?.email ?? '',
    address: '',
    city:    '',
    country: 'Italy',
  })
  const [payment, setPayment] = useState({
    card: '', expiry: '', cvv: '', cardName: '',
  })

  const handleReset = () => {
    setStep(0); setOrderId(null); setErrors({})
    setShipping({ name: '', email: '', address: '', city: '', country: 'Italy' })
    setPayment({ card: '', expiry: '', cvv: '', cardName: '' })
    onClose()
  }

  const validateShipping = () => {
    const e = {}
    if (!shipping.name.trim())                        e.name    = 'Required'
    if (!shipping.email || !/\S+@\S+\.\S+/.test(shipping.email)) e.email   = 'Valid email required'
    if (!shipping.address.trim())                     e.address = 'Required'
    if (!shipping.city.trim())                        e.city    = 'Required'
    return e
  }

  const validatePayment = () => {
    const e = {}
    const card = payment.card.replace(/\s/g, '')
    if (!card || card.length < 12 || card.length > 19 || !/^\d+$/.test(card)) e.card = 'Enter a valid card number'
    if (!payment.expiry || !/^\d{2}\/\d{2}$/.test(payment.expiry)) e.expiry = 'Use MM/YY format'
    if (!payment.cvv || !/^\d{3,4}$/.test(payment.cvv))            e.cvv    = '3 or 4 digits'
    if (!payment.cardName.trim())                                   e.cardName = 'Required'
    return e
  }

  const formatCard = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)

  const placeOrder = async () => {
    setLoading(true)
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        shippingName:    shipping.name,
        shippingEmail:   shipping.email,
        shippingAddress: shipping.address,
        shippingCity:    shipping.city,
        shippingCountry: shipping.country,
      }

      let id
      try {
        const res = await api.post('/orders', payload)
        id = res.orderId
      } catch {
        // Simulate order ID when backend is unavailable
        id = `HX-${Date.now().toString(36).toUpperCase()}`
      }

      setOrderId(id)
      clearCart()
      setStep(3)
    } catch (err) {
      addToast(err.message || 'Order failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (step === 0) { setStep(1); return }
    if (step === 1) {
      const e = validateShipping()
      if (Object.keys(e).length) { setErrors(e); return }
      setErrors({}); setStep(2); return
    }
    if (step === 2) {
      const e = validatePayment()
      if (Object.keys(e).length) { setErrors(e); return }
      setErrors({})
      await placeOrder()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={step < 3 ? onClose : undefined}
          />

          <motion.div
            className="fixed inset-0 z-[111] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto bg-hx-surface border border-hx-border rounded-2xl w-full max-w-lg max-h-[92dvh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1,    y: 0  }}
              exit={{    scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
              role="dialog"
              aria-modal="true"
              aria-label="Checkout"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-1">
                <h2 className="text-hx-text font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  {step < 3 ? 'Checkout' : 'Order Confirmed'}
                </h2>
                {step < 3 && (
                  <button onClick={onClose} className="p-2 rounded-xl text-hx-muted hover:text-hx-text hover:bg-white/5 transition-colors" aria-label="Close">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {step < 3 && <StepIndicator current={step} />}

              <div className="px-6 pb-6 pt-2">

                {/* ── Step 0: Review ── */}
                {step === 0 && (
                  <div className="space-y-3">
                    {items.length === 0 ? (
                      <p className="text-hx-muted text-sm py-6 text-center">Your cart is empty.</p>
                    ) : (
                      <>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {items.map((i) => (
                            <div key={i.product.id} className="flex justify-between text-sm border-b border-hx-border pb-2">
                              <span className="text-hx-text line-clamp-1 flex-1 pr-4">{i.product.name} <span className="text-hx-muted">×{i.quantity}</span></span>
                              <span className="text-hx-text font-medium shrink-0">${(i.product.price * i.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between font-bold text-hx-text pt-1">
                          <span>Total</span>
                          <span style={{ fontFamily: 'var(--font-display)' }}>${totalPrice.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-hx-muted border border-hx-warning/30 bg-hx-warning/5 rounded-lg px-3 py-2">
                          ⚠ This is a simulated checkout. No real payment is processed.
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* ── Step 1: Shipping ── */}
                {step === 1 && (
                  <div className="space-y-3">
                    <Field label="Full Name" id="s-name" error={errors.name}>
                      <input id="s-name" type="text" value={shipping.name} onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))} className={clsx('input-field', errors.name && 'error')} placeholder="Alex Morgan" autoComplete="name" />
                    </Field>
                    <Field label="Email" id="s-email" error={errors.email}>
                      <input id="s-email" type="email" value={shipping.email} onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))} className={clsx('input-field', errors.email && 'error')} placeholder="alex@example.com" autoComplete="email" />
                    </Field>
                    <Field label="Street Address" id="s-addr" error={errors.address}>
                      <input id="s-addr" type="text" value={shipping.address} onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))} className={clsx('input-field', errors.address && 'error')} placeholder="Via Roma 1" autoComplete="street-address" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="City" id="s-city" error={errors.city}>
                        <input id="s-city" type="text" value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} className={clsx('input-field', errors.city && 'error')} placeholder="Milan" autoComplete="address-level2" />
                      </Field>
                      <Field label="Country" id="s-country">
                        <select id="s-country" value={shipping.country} onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))} className="input-field">
                          {['Italy','Germany','France','Spain','Netherlands','Austria','Belgium','Portugal','Sweden','UK'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Payment ── */}
                {step === 2 && (
                  <div className="space-y-3">
                    <Field label="Name on Card" id="p-name" error={errors.cardName}>
                      <input id="p-name" type="text" value={payment.cardName} onChange={(e) => setPayment((p) => ({ ...p, cardName: e.target.value }))} className={clsx('input-field', errors.cardName && 'error')} placeholder="Alex Morgan" autoComplete="cc-name" />
                    </Field>
                    <Field label="Card Number" id="p-card" error={errors.card}>
                      <input id="p-card" type="text" value={payment.card} onChange={(e) => setPayment((p) => ({ ...p, card: formatCard(e.target.value) }))} className={clsx('input-field font-mono tracking-widest', errors.card && 'error')} placeholder="1234 5678 9012 3456" maxLength={19} autoComplete="cc-number" inputMode="numeric" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Expiry (MM/YY)" id="p-exp" error={errors.expiry}>
                        <input id="p-exp" type="text" value={payment.expiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g,'')
                            if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2,4)
                            setPayment((p) => ({ ...p, expiry: v }))
                          }}
                          className={clsx('input-field font-mono', errors.expiry && 'error')}
                          placeholder="MM/YY" maxLength={5} autoComplete="cc-exp" inputMode="numeric" />
                      </Field>
                      <Field label="CVV" id="p-cvv" error={errors.cvv}>
                        <input id="p-cvv" type="text" value={payment.cvv} onChange={(e) => setPayment((p) => ({ ...p, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))} className={clsx('input-field font-mono', errors.cvv && 'error')} placeholder="•••" maxLength={4} autoComplete="cc-csc" inputMode="numeric" />
                      </Field>
                    </div>
                    <p className="text-[11px] text-hx-muted flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-hx-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path strokeLinecap="round" d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      Simulated payment — no real charges apply
                    </p>
                  </div>
                )}

                {/* ── Step 3: Confirmed ── */}
                {step === 3 && (
                  <div className="flex flex-col items-center py-6 text-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-hx-green/15 border border-hx-green/40 flex items-center justify-center"
                    >
                      <svg className="w-8 h-8 text-hx-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="text-hx-text font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>
                        Order Placed!
                      </h3>
                      <p className="text-hx-muted text-sm mt-1">Thank you for shopping at HEXCORE</p>
                    </div>
                    <div className="bg-hx-card border border-hx-border rounded-xl px-6 py-4 w-full">
                      <p className="text-hx-muted text-xs uppercase tracking-wider mb-1">Order ID</p>
                      <p className="text-hx-accent font-mono font-bold text-sm">{orderId}</p>
                    </div>
                    <p className="text-hx-muted text-xs">A confirmation email will be sent to <span className="text-hx-text">{shipping.email}</span></p>
                    <button onClick={handleReset} className="btn-primary w-full mt-2">
                      Continue Shopping
                    </button>
                  </div>
                )}

                {/* Navigation buttons */}
                {step < 3 && (
                  <div className="flex gap-3 mt-5">
                    {step > 0 && (
                      <button onClick={() => setStep((s) => s - 1)} className="btn-secondary flex-1">
                        Back
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      disabled={loading || (step === 0 && items.length === 0)}
                      className="btn-primary flex-1"
                    >
                      {loading ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : step === 2 ? 'Place Order' : 'Continue'}
                    </button>
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
