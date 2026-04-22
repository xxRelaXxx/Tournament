/** Typed helpers for HEXCORE localStorage keys */

const KEYS = {
  AUTH:  'hexcore_auth',
  TOKEN: 'hexcore_token',
  CART:  'hexcore_cart',
}

export const storage = {
  getAuth()       { return JSON.parse(localStorage.getItem(KEYS.AUTH)  || 'null') },
  setAuth(user)   { localStorage.setItem(KEYS.AUTH, JSON.stringify(user)) },
  clearAuth()     { localStorage.removeItem(KEYS.AUTH); localStorage.removeItem(KEYS.TOKEN) },

  getToken()      { return localStorage.getItem(KEYS.TOKEN) || null },
  setToken(t)     { localStorage.setItem(KEYS.TOKEN, t) },

  getCart()       { return JSON.parse(localStorage.getItem(KEYS.CART)  || '[]') },
  setCart(items)  { localStorage.setItem(KEYS.CART, JSON.stringify(items)) },
  clearCart()     { localStorage.removeItem(KEYS.CART) },
}
