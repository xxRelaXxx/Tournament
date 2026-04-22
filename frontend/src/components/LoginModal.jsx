import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

function FormField({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-hx-muted mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-hx-error text-xs">{error}</p>}
    </div>
  )
}

export default function LoginModal({ open, onClose }) {
  const { login, register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')  // 'login' | 'register'
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [firstName, setFirstName]     = useState('')
  const [lastName, setLastName]       = useState('')
  const [showPass, setShowPass]       = useState(false)
  const [loading, setLoading]         = useState(false)
  const [errors, setErrors]           = useState({})

  const validate = () => {
    const e = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required'
    if (!password || password.length < 6) e.password = 'Minimum 6 characters'
    if (mode === 'register') {
      if (!firstName.trim()) e.firstName = 'First name required'
      if (!lastName.trim())  e.lastName  = 'Last name required'
      if (!/(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
        e.password = 'Must include uppercase letter and number'
      }
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    let result
    if (mode === 'login') {
      result = await login(email, password)
    } else {
      result = await register(email, password, firstName, lastName)
    }

    setLoading(false)

    if (result.ok) {
      addToast(`Welcome${result.user?.firstName ? `, ${result.user.firstName}` : ''}!`, 'success')
      if (result.user?.role === 'admin') navigate('/admin')
      onClose()
      // Reset form
      setEmail(''); setPassword(''); setFirstName(''); setLastName('')
    } else {
      setErrors({ form: result.error || 'Something went wrong' })
    }
  }

  const reset = (m) => { setMode(m); setErrors({}); setEmail(''); setPassword('') }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto bg-hx-surface border border-hx-border rounded-2xl w-full max-w-sm overflow-hidden"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1,    y: 0  }}
              exit={{    scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  {/* Logo mark */}
                  <div className="flex items-center gap-2">
                    <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
                      <polygon points="17,2 31,9.5 31,24.5 17,32 3,24.5 3,9.5" fill="none" stroke="#00C6FF" strokeWidth="1.8"/>
                      <polygon points="17,8 25,12.5 25,21.5 17,26 9,21.5 9,12.5" fill="rgba(0,198,255,0.12)" stroke="#00C6FF" strokeWidth="0.8"/>
                      <text x="17" y="21" textAnchor="middle" fill="#00C6FF" fontSize="8" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">HX</text>
                    </svg>
                    <span className="text-hx-text font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>HEXCORE</span>
                  </div>
                  <button onClick={onClose} className="p-1.5 rounded-lg text-hx-muted hover:text-hx-text hover:bg-white/5 transition-colors">
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <h2 className="text-hx-text font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>
                  {mode === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-hx-muted text-xs mt-1">
                  {mode === 'login'
                    ? 'Sign in as a customer or administrator'
                    : 'Join HEXCORE for a personalised experience'
                  }
                </p>
              </div>

              {/* Tabs */}
              <div className="px-6 pb-2">
                <div className="flex bg-hx-card rounded-xl p-1 border border-hx-border">
                  {[
                    { id: 'login',    label: 'Customer' },
                    { id: 'register', label: 'Create Account' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => reset(t.id)}
                      className={clsx(
                        'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all',
                        mode === t.id
                          ? 'bg-hx-accent text-hx-bg'
                          : 'text-hx-muted hover:text-hx-text'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 pb-6 pt-3 space-y-3" noValidate>
                {/* Name fields (register only) */}
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="First Name" id="firstName" error={errors.firstName}>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={clsx('input-field', errors.firstName && 'error')}
                        placeholder="Alex"
                        autoComplete="given-name"
                      />
                    </FormField>
                    <FormField label="Last Name" id="lastName" error={errors.lastName}>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={clsx('input-field', errors.lastName && 'error')}
                        placeholder="Morgan"
                        autoComplete="family-name"
                      />
                    </FormField>
                  </div>
                )}

                <FormField label="Email address" id="email" error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={clsx('input-field', errors.email && 'error')}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </FormField>

                <FormField label="Password" id="password" error={errors.password}>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={clsx('input-field pr-10', errors.password && 'error')}
                      placeholder={mode === 'register' ? 'Min. 8 chars, 1 uppercase, 1 number' : '••••••••'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-hx-muted hover:text-hx-text transition-colors"
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      }
                    </button>
                  </div>
                </FormField>

                {/* Form-level error */}
                {errors.form && (
                  <p className="text-hx-error text-xs bg-hx-error/10 border border-hx-error/30 rounded-lg px-3 py-2">
                    {errors.form}
                  </p>
                )}

                {/* Demo hint */}
                {mode === 'login' && (
                  <p className="text-hx-muted text-[11px]">
                    Demo — Admin: <span className="text-hx-accent">admin@hexcore.tech</span> / <span className="text-hx-accent">Admin@2025</span>
                  </p>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
