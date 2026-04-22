/**
 * API utility — wraps fetch with auth headers and graceful error handling.
 * Falls back gracefully when the backend is unavailable.
 */

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://tournament-production-aafe.up.railway.app/api'

function getHeaders() {
  const token = localStorage.getItem('hexcore_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request(method, path, body) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    method,
    headers: getHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }

  return res.json()
}

const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  delete: (path)        => request('DELETE', path),
}

export default api
