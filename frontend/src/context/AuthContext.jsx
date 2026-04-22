import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import { storage } from '../utils/localStorage'

const AuthContext = createContext(null)

/** Demo credentials — used when backend is unavailable */
const DEMO_USERS = {
  'admin@hexcore.tech': { password: 'Admin@2025', role: 'admin',  firstName: 'Alex',   lastName: 'Morgan' },
  'user@hexcore.tech':  { password: 'User@2025',  role: 'user',   firstName: 'Jordan', lastName: 'Smith'  },
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const saved = storage.getAuth()
    const token = storage.getToken()
    if (saved && token) {
      setUser(saved)
      // Silently verify the token is still valid
      api.get('/auth/me')
        .then((u) => setUser(u))
        .catch(() => { /* keep local session — backend may be offline */ })
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    // Try real backend first
    try {
      const data = await api.post('/auth/login', { email, password })
      storage.setToken(data.token)
      storage.setAuth(data.user)
      setUser(data.user)
      return { ok: true, user: data.user }
    } catch (_) {
      // Fallback: demo credentials (works offline / before DB init)
      const demo = DEMO_USERS[email.toLowerCase()]
      if (demo && demo.password === password) {
        const mockUser = {
          id:        `demo-${demo.role}`,
          email:     email.toLowerCase(),
          firstName: demo.firstName,
          lastName:  demo.lastName,
          role:      demo.role,
        }
        storage.setAuth(mockUser)
        storage.setToken('demo-token')
        setUser(mockUser)
        return { ok: true, user: mockUser }
      }
      return { ok: false, error: 'Invalid email or password' }
    }
  }, [])

  const register = useCallback(async (email, password, firstName, lastName) => {
    try {
      const data = await api.post('/auth/register', { email, password, firstName, lastName })
      storage.setToken(data.token)
      storage.setAuth(data.user)
      setUser(data.user)
      return { ok: true, user: data.user }
    } catch (err) {
      return { ok: false, error: err.message || 'Registration failed' }
    }
  }, [])

  const logout = useCallback(() => {
    storage.clearAuth()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
