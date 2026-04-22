import { useMemo } from 'react'
import { useProducts } from '../hooks/useProducts.js'
import ProductCard from './ProductCard.jsx'
import LoadingSkeleton from './LoadingSkeleton.jsx'

function EmptyState({ searchQuery, activeCategory }) {
  const msg = searchQuery
    ? `No products match "${searchQuery}"`
    : `No products in ${activeCategory} yet`

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg
        className="w-16 h-16 text-hx-border mb-4"
        fill="none"
        viewBox="0 0 64 64"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="28" cy="28" r="18" />
        <path strokeLinecap="round" d="M42 42l12 12" />
        <path strokeLinecap="round" d="M20 28h16M28 20v16" opacity="0.4" />
      </svg>
      <p className="text-hx-muted text-sm mb-1">{msg}</p>
      <p className="text-hx-muted/60 text-xs">Try a different search term or category</p>
    </div>
  )
}

export default function ProductGrid({ searchQuery, activeCategory }) {
  const { products, loading } = useProducts()

  const filtered = useMemo(() => {
    let list = products
    if (activeCategory && activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      )
    }
    return list
  }, [products, searchQuery, activeCategory])

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Results count */}
      {!loading && (
        <div className="flex items-center justify-between mb-5">
          <p className="text-hx-muted text-sm">
            {filtered.length === 0 ? 'No results' : (
              <>
                <span className="text-hx-text font-medium">{filtered.length}</span>
                {' '}product{filtered.length !== 1 ? 's' : ''}
                {activeCategory !== 'all' && (
                  <> in <span className="text-hx-accent capitalize">{activeCategory}</span></>
                )}
                {searchQuery && (
                  <> for <span className="text-hx-accent">"{searchQuery}"</span></>
                )}
              </>
            )}
          </p>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <EmptyState searchQuery={searchQuery} activeCategory={activeCategory} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
