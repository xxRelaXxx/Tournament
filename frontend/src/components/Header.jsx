import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

/** HEXCORE hex-shape logo mark */
function HexLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <polygon
        points="17,2 31,9.5 31,24.5 17,32 3,24.5 3,9.5"
        fill="none"
        stroke="#00C6FF"
        strokeWidth="1.8"
      />
      <polygon
        points="17,8 25,12.5 25,21.5 17,26 9,21.5 9,12.5"
        fill="rgba(0,198,255,0.12)"
        stroke="#00C6FF"
        strokeWidth="0.8"
      />
      <text x="17" y="21" textAnchor="middle" fill="#00C6FF" fontSize="8" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">HX</text>
    </svg>
  )
}

/** Cart icon SVG */
function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 21a1 1 0 11-2 0 1 1 0 012 0zm9 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  )
}

/** Person icon SVG */
function PersonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  )
}

export default function Header({ onCartOpen, onLoginOpen }) {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isAdmin = user?.role === 'admin'
  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : null

  return (
    <header className="sticky top-0 z-50 h-16 bg-hx-surface/95 backdrop-blur-sm border-b border-hx-border">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-hx-accent rounded-lg"
          aria-label="HEXCORE — Home"
        >
          <HexLogo />
          <div className="flex flex-col leading-none">
            <span
              className="text-hx-text font-bold tracking-widest text-[15px]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              HEXCORE
            </span>
            <span className="text-hx-muted text-[9px] tracking-[0.18em] uppercase">
              Tech Accessories
            </span>
          </div>
        </button>

        {/* ── Nav links (desktop) ── */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {[
            { label: 'Shop',    path: '/' },
            ...(isAdmin ? [{ label: 'Admin Panel', path: '/admin' }] : []),
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === path
                  ? 'text-hx-accent bg-hx-accent/8'
                  : 'text-hx-muted hover:text-hx-text hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button
            onClick={onCartOpen}
            aria-label={`Cart, ${totalItems} items`}
            className="relative p-2.5 rounded-xl text-hx-muted hover:text-hx-text hover:bg-white/5 transition-colors"
          >
            <CartIcon />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-hx-orange text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          {/* User button */}
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <span className="hidden sm:block badge bg-hx-purple/20 text-hx-purple border border-hx-purple/30">
                  Admin
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #00C6FF)' }}
                  aria-label={`${user.firstName} ${user.lastName}`}
                >
                  {initials}
                </div>
                <button
                  onClick={logout}
                  className="hidden sm:block text-xs text-hx-muted hover:text-hx-error transition-colors px-2 py-1 rounded-lg hover:bg-red-950/30"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onLoginOpen}
              aria-label="Sign in"
              className="p-2.5 rounded-xl text-hx-muted hover:text-hx-text hover:bg-white/5 transition-colors"
            >
              <PersonIcon />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
