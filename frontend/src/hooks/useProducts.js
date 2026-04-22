import { useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import { mockProducts } from '../data/mockProducts'

/**
 * Product data hook — tries the backend API, falls back to mock data.
 * Admin CRUD also falls back to local state when backend is unavailable.
 */
export function useProducts() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [usingMock, setUsingMock] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get('/products')
      setProducts(data.products || data)
      setUsingMock(false)
    } catch {
      setProducts(mockProducts)
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const createProduct = useCallback(async (payload) => {
    try {
      const created = await api.post('/products', payload)
      setProducts((prev) => [created, ...prev])
      return { ok: true, product: created }
    } catch (err) {
      if (usingMock) {
        // Local-only creation
        const mock = { ...payload, id: `local-${Date.now()}`, created_at: new Date().toISOString() }
        setProducts((prev) => [mock, ...prev])
        return { ok: true, product: mock }
      }
      return { ok: false, error: err.message }
    }
  }, [usingMock])

  const updateProduct = useCallback(async (id, payload) => {
    try {
      const updated = await api.put(`/products/${id}`, payload)
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
      return { ok: true, product: updated }
    } catch (err) {
      if (usingMock) {
        const updated = { ...payload, id }
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
        return { ok: true, product: updated }
      }
      return { ok: false, error: err.message }
    }
  }, [usingMock])

  const deleteProduct = useCallback(async (id) => {
    try {
      await api.delete(`/products/${id}`)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      return { ok: true }
    } catch (err) {
      if (usingMock) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        return { ok: true }
      }
      return { ok: false, error: err.message }
    }
  }, [usingMock])

  return {
    products,
    loading,
    error,
    usingMock,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
