import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { storage } from '../utils/localStorage'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'RESTORE':
      return action.items

    case 'ADD': {
      const existing = state.find((i) => i.product.id === action.product.id)
      if (existing) {
        return state.map((i) =>
          i.product.id === action.product.id
            ? { ...i, quantity: Math.min(i.quantity + action.qty, action.product.stock) }
            : i
        )
      }
      return [...state, { product: action.product, quantity: action.qty }]
    }

    case 'REMOVE':
      return state.filter((i) => i.product.id !== action.id)

    case 'UPDATE_QTY':
      return state
        .map((i) =>
          i.product.id === action.id ? { ...i, quantity: action.qty } : i
        )
        .filter((i) => i.quantity > 0)

    case 'CLEAR':
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  // Restore cart from localStorage on mount
  useEffect(() => {
    const saved = storage.getCart()
    if (saved.length > 0) dispatch({ type: 'RESTORE', items: saved })
  }, [])

  // Persist cart to localStorage on every change
  useEffect(() => {
    storage.setCart(items)
  }, [items])

  const addItem = useCallback((product, qty = 1) => {
    dispatch({ type: 'ADD', product, qty })
  }, [])

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE', id })
  }, [])

  const updateQty = useCallback((id, qty) => {
    dispatch({ type: 'UPDATE_QTY', id, qty })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
    storage.clearCart()
  }, [])

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
  const totalPrice = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
