import { useNavigate } from 'react-router-dom'

const CATEGORY_PILLS = ['Keyboards', 'Mice', 'Headsets', 'Monitors', 'Hubs']

// Simple decorative hex-grid SVG lines — purely CSS/SVG, no external images
function HexGridDecor() {
  const hexes = []
  const cols = 6, rows = 5
  const W = 56, H = 64
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * W + (r % 2 === 1 ? W / 2 : 0)
      const y = r * (H * 0.75)
      hexes.push({ x, y, key: `${r}-${c}` })
    }
  }
  const pts = (cx, cy, size) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6
      return `${cx + size * Math.cos(a)},${cy + size * Math.sin(a)}`
    }).join(' ')

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.07]"
      viewBox="0 0 336 256"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {hexes.map(({ x, y, key }) => (
        <polygon
          key={key}
          points={pts(x + 14, y + 14, 22)}
          fill="none"
          stroke="#00C6FF"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  )
}

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden border-b border-hx-border bg-hx-surface">
      {/* Background hex grid */}
      <HexGridDecor />

      {/* Gradient vignette from left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(7,9,15,0.95) 30%, rgba(7,9,15,0.4) 70%, transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-16 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0">
        {/* Text block */}
        <div className="md:w-3/5 space-y-4">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-px bg-hx-accent" />
            <span className="text-hx-accent text-xs font-bold tracking-[0.2em] uppercase">
              Spring 2026 Collection
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-hx-text leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Precision Tech for
            <br />
            <span
              className="inline-block"
              style={{
                background: 'linear-gradient(90deg, #00C6FF, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              the Modern Setup
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-hx-muted text-sm md:text-base max-w-md leading-relaxed">
            Curated tech accessories engineered for performance, comfort, and aesthetics.
            Every product is tested, every detail deliberate.
          </p>

          {/* CTA + category pills */}
          <div className="flex flex-col sm:flex-row gap-3 items-start pt-1">
            <button
              onClick={() => navigate('/')}
              className="btn-primary text-sm px-5 py-2.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              Browse Catalog
            </button>

            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_PILLS.map((c) => (
                <span
                  key={c}
                  className="text-[11px] font-medium text-hx-muted border border-hx-border rounded-full px-3 py-1 bg-hx-card/50"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats block (desktop) */}
        <div className="hidden md:flex md:w-2/5 justify-end gap-6">
          {[
            { value: '200+', label: 'SKUs in Stock' },
            { value: '4.7★', label: 'Avg. Rating' },
            { value: '48h', label: 'Dispatch Time' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-2xl font-bold text-hx-accent"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {value}
              </div>
              <div className="text-xs text-hx-muted mt-0.5 whitespace-nowrap">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
