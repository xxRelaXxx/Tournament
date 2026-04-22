import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useProducts } from '../hooks/useProducts.js'
import { useToast } from '../context/ToastContext.jsx'
import { CATEGORIES, CATEGORY_STYLE } from '../data/mockProducts.js'

/* ── Product Form (create / edit) ───────────────────────────────── */
function ProductForm({ initial, onSave, onCancel, loading }) {
  const empty = {
    name: '', category: 'keyboards', description: '', price: '',
    original_price: '', stock: '', rating: '4.5', reviews_count: '0',
    featured: false,
  }
  const [form, setForm]   = useState(initial || empty)
  const [errors, setErrs] = useState({})

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())              e.name        = 'Required'
    if (!form.description.trim())       e.description = 'Required'
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) e.price = 'Valid price required'
    if (isNaN(parseInt(form.stock))  || parseInt(form.stock)  < 0)    e.stock = 'Stock must be ≥ 0'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrs(errs); return }
    setErrs({})
    onSave({
      ...form,
      price:          parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      stock:          parseInt(form.stock),
      rating:         parseFloat(form.rating) || 0,
      reviews_count:  parseInt(form.reviews_count) || 0,
    })
  }

  const Field = ({ label, id, error, children }) => (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-hx-muted mb-1">{label}</label>
      {children}
      {error && <p className="text-hx-error text-[11px] mt-0.5">{error}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Product Name *" id="f-name" error={errors.name}>
        <input id="f-name" type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
          className={clsx('input-field', errors.name && 'error')} placeholder="HX-PRO K1 Mechanical Keyboard" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Category *" id="f-cat">
          <select id="f-cat" value={form.category} onChange={(e) => set('category', e.target.value)} className="input-field">
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Stock *" id="f-stock" error={errors.stock}>
          <input id="f-stock" type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)}
            className={clsx('input-field', errors.stock && 'error')} placeholder="50" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Price ($) *" id="f-price" error={errors.price}>
          <input id="f-price" type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => set('price', e.target.value)}
            className={clsx('input-field', errors.price && 'error')} placeholder="149.99" />
        </Field>
        <Field label="Original Price ($)" id="f-oprice">
          <input id="f-oprice" type="number" step="0.01" min="0" value={form.original_price} onChange={(e) => set('original_price', e.target.value)}
            className="input-field" placeholder="199.99 (optional)" />
        </Field>
      </div>

      <Field label="Description *" id="f-desc" error={errors.description}>
        <textarea id="f-desc" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)}
          className={clsx('input-field resize-none', errors.description && 'error')}
          placeholder="Full product description..." />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Rating (0–5)" id="f-rating">
          <input id="f-rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => set('rating', e.target.value)}
            className="input-field" />
        </Field>
        <Field label="Review Count" id="f-reviews">
          <input id="f-reviews" type="number" min="0" value={form.reviews_count} onChange={(e) => set('reviews_count', e.target.value)}
            className="input-field" />
        </Field>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <div
          onClick={() => set('featured', !form.featured)}
          className={clsx(
            'w-10 h-5 rounded-full transition-colors relative',
            form.featured ? 'bg-hx-accent' : 'bg-hx-border'
          )}
        >
          <div className={clsx(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow',
            form.featured ? 'left-5.5' : 'left-0.5'
          )} />
        </div>
        <span className="text-sm text-hx-muted">Featured product</span>
      </label>

      <div className="flex gap-3 pt-2 border-t border-hx-border">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading
            ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            : initial ? 'Save Changes' : 'Add Product'
          }
        </button>
      </div>
    </form>
  )
}

/* ── Delete Confirm ─────────────────────────────────────────────── */
function DeleteConfirm({ product, onConfirm, onCancel }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-hx-error/10 border border-hx-error/30 rounded-xl p-4">
        <svg className="w-5 h-5 text-hx-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <div>
          <p className="text-hx-text font-semibold text-sm">Delete Product?</p>
          <p className="text-hx-muted text-xs mt-1">
            <span className="font-medium text-hx-text">"{product.name}"</span> will be permanently removed. This action cannot be undone.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button onClick={onConfirm}
          className="flex-1 btn-primary bg-hx-error hover:bg-red-600"
          style={{ background: 'var(--color-hx-error)' }}>
          Delete
        </button>
      </div>
    </div>
  )
}

/* ── Main AdminPanel ────────────────────────────────────────────── */
export default function AdminPanel() {
  const { products, loading, usingMock, createProduct, updateProduct, deleteProduct } = useProducts()
  const { addToast } = useToast()

  const [modalType, setModalType] = useState(null)   // 'create' | 'edit' | 'delete'
  const [selected, setSelected]   = useState(null)
  const [saving, setSaving]       = useState(false)
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('all')

  const filtered = useMemo(() => {
    let list = products
    if (filterCat !== 'all') list = list.filter((p) => p.category === filterCat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    return list
  }, [products, filterCat, search])

  const openCreate = () => { setSelected(null); setModalType('create') }
  const openEdit   = (p) => { setSelected(p);   setModalType('edit')   }
  const openDelete = (p) => { setSelected(p);   setModalType('delete') }
  const closeModal = () => { setModalType(null); setSelected(null) }

  const handleSave = async (data) => {
    setSaving(true)
    const result = modalType === 'edit'
      ? await updateProduct(selected.id, data)
      : await createProduct(data)
    setSaving(false)
    if (result.ok) {
      addToast(modalType === 'edit' ? 'Product updated' : 'Product created', 'success')
      closeModal()
    } else {
      addToast(result.error || 'Save failed', 'error')
    }
  }

  const handleDelete = async () => {
    const result = await deleteProduct(selected.id)
    if (result.ok) {
      addToast(`"${selected.name}" deleted`, 'info')
      closeModal()
    } else {
      addToast(result.error || 'Delete failed', 'error')
    }
  }

  // Stats
  const stats = useMemo(() => ({
    total:   products.length,
    inStock: products.filter((p) => p.stock > 0).length,
    featured:products.filter((p) => p.featured).length,
    lowStock:products.filter((p) => p.stock > 0 && p.stock <= 5).length,
  }), [products])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page title */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-hx-text text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Product Management
          </h1>
          <p className="text-hx-muted text-sm mt-0.5">
            {usingMock && (
              <span className="text-hx-warning inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Offline mode — changes are local only.{' '}
              </span>
            )}
            {stats.total} products total
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Products', value: stats.total,   color: 'text-hx-accent' },
          { label: 'In Stock',       value: stats.inStock, color: 'text-hx-green'  },
          { label: 'Featured',       value: stats.featured,color: 'text-hx-orange' },
          { label: 'Low Stock',      value: stats.lowStock,color: 'text-hx-warning'},
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-hx-card border border-hx-border rounded-xl p-4">
            <p className={`text-2xl font-bold ${color}`} style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
            <p className="text-hx-muted text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hx-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9" placeholder="Search products..." />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input-field sm:w-44">
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-hx-card border border-hx-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-hx-muted text-sm">Loading products…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-hx-muted text-sm">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-hx-border">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-hx-muted text-xs font-semibold uppercase tracking-wide px-4 py-3 first:pl-5 last:pr-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => {
                  const s = CATEGORY_STYLE[p.category] || CATEGORY_STYLE.accessories
                  return (
                    <tr key={p.id} className={clsx('border-b border-hx-border last:border-0 hover:bg-hx-card-hover transition-colors', idx % 2 === 1 && 'bg-hx-bg/30')}>
                      <td className="px-4 py-3 pl-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex-shrink-0"
                            style={{ background: `linear-gradient(145deg, ${s.gradFrom}, ${s.gradTo})`, boxShadow: `0 0 8px ${s.accent}33` }}
                          />
                          <div>
                            <p className="text-hx-text font-medium leading-snug line-clamp-1">{p.name}</p>
                            {p.featured && (
                              <span className="text-[10px] text-hx-orange">★ Featured</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge text-[10px] capitalize" style={{ background: `${s.accent}22`, color: s.accent, border: `1px solid ${s.accent}44` }}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-hx-text" style={{ fontFamily: 'var(--font-display)' }}>
                        ${p.price.toFixed(2)}
                        {p.original_price && (
                          <span className="text-hx-muted text-xs line-through ml-1">${p.original_price.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx(
                          'font-medium',
                          p.stock === 0     ? 'text-hx-error'   :
                          p.stock <= 5      ? 'text-hx-warning' : 'text-hx-green'
                        )}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-hx-muted">{p.rating.toFixed(1)} ★</td>
                      <td className="px-4 py-3 pr-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg text-hx-muted hover:text-hx-accent hover:bg-hx-accent/10 transition-colors"
                            aria-label={`Edit ${p.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openDelete(p)}
                            className="p-1.5 rounded-lg text-hx-muted hover:text-hx-error hover:bg-hx-error/10 transition-colors"
                            aria-label={`Delete ${p.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalType && (
          <>
            <motion.div
              className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            <motion.div
              className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="pointer-events-auto bg-hx-surface border border-hx-border rounded-2xl w-full max-w-md max-h-[90dvh] overflow-y-auto"
                initial={{ scale: 0.95, y: 16 }}
                animate={{ scale: 1,    y: 0  }}
                exit={{    scale: 0.95, y: 16 }}
                transition={{ type: 'spring', damping: 28, stiffness: 340 }}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-hx-border">
                  <h2 className="text-hx-text font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {modalType === 'create' ? 'Add New Product' : modalType === 'edit' ? 'Edit Product' : 'Delete Product'}
                  </h2>
                  <button onClick={closeModal} className="p-2 rounded-xl text-hx-muted hover:text-hx-text hover:bg-white/5 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  {modalType === 'delete' ? (
                    <DeleteConfirm product={selected} onConfirm={handleDelete} onCancel={closeModal} />
                  ) : (
                    <ProductForm
                      initial={modalType === 'edit' ? {
                        ...selected,
                        price: selected.price,
                        original_price: selected.original_price || '',
                        stock: selected.stock,
                      } : null}
                      onSave={handleSave}
                      onCancel={closeModal}
                      loading={saving}
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
