import { useRef } from 'react'
import clsx from 'clsx'
import { CATEGORIES } from '../data/mockProducts.js'

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-hx-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function SearchBar({ query, onQueryChange, activeCategory, onCategoryChange }) {
  const inputRef = useRef(null)

  return (
    <div className="sticky top-16 z-40 bg-hx-surface border-b border-hx-border shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Search input */}
        <div className="relative max-w-2xl">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search keyboards, mice, monitors..."
            className="input-field pl-10 pr-10 py-2.5"
            aria-label="Search products"
          />
          {query && (
            <button
              onClick={() => { onQueryChange(''); inputRef.current?.focus() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-hx-muted hover:text-hx-text transition-colors"
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div
          className="flex gap-1.5 mt-2.5 overflow-x-auto scrollbar-hide pb-0.5"
          role="group"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={clsx(
                'px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border',
                activeCategory === cat.id
                  ? 'bg-hx-accent text-hx-bg border-hx-accent'
                  : 'bg-transparent border-hx-border text-hx-muted hover:text-hx-text hover:border-hx-border-hi'
              )}
              aria-pressed={activeCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
