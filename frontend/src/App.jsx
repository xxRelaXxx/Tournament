import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Header        from './components/Header.jsx'
import SearchBar     from './components/SearchBar.jsx'
import HeroSection   from './components/HeroSection.jsx'
import ProductGrid   from './components/ProductGrid.jsx'
import CartSidebar   from './components/CartSidebar.jsx'
import LoginModal    from './components/LoginModal.jsx'
import CheckoutModal from './components/CheckoutModal.jsx'
import AdminPanel    from './components/AdminPanel.jsx'
import Footer        from './components/Footer.jsx'

function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  const [cartOpen,       setCartOpen]       = useState(false)
  const [loginOpen,      setLoginOpen]      = useState(false)
  const [checkoutOpen,   setCheckoutOpen]   = useState(false)
  const [searchQuery,    setSearchQuery]    = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  return (
    <div className="min-h-dvh flex flex-col bg-hx-bg text-hx-text">
      <Header
        onCartOpen={()  => setCartOpen(true)}
        onLoginOpen={() => setLoginOpen(true)}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchBar
                query={searchQuery}
                onQueryChange={setSearchQuery}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
              <main className="flex-1">
                <HeroSection />
                <ProductGrid
                  searchQuery={searchQuery}
                  activeCategory={activeCategory}
                />
              </main>
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <main className="flex-1">
                <AdminPanel />
              </main>
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
      />
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  )
}

