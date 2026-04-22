const LINKS = [
  { label: 'Conditions of Use & Sale', href: '#' },
  { label: 'Privacy Notice',           href: '#' },
  { label: 'Legal Area',               href: '#' },
  { label: 'Cookies Notice',           href: '#' },
  { label: 'Interest-Based Ads Notice',href: '#' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-hx-surface border-t border-hx-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Brand row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <polygon points="17,2 31,9.5 31,24.5 17,32 3,24.5 3,9.5" fill="none" stroke="#00C6FF" strokeWidth="1.8"/>
              <polygon points="17,8 25,12.5 25,21.5 17,26 9,21.5 9,12.5" fill="rgba(0,198,255,0.12)" stroke="#00C6FF" strokeWidth="0.8"/>
              <text x="17" y="21" textAnchor="middle" fill="#00C6FF" fontSize="8" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">HX</text>
            </svg>
            <div>
              <span className="text-hx-text font-bold text-sm tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
                HEXCORE
              </span>
              <p className="text-hx-muted text-[10px] tracking-wider">Precision Tech. Engineered for Performance.</p>
            </div>
          </div>

          {/* Mini links */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {['Keyboards', 'Mice', 'Headsets', 'Monitors', 'Accessories'].map((cat) => (
              <span key={cat} className="text-hx-muted text-xs hover:text-hx-text transition-colors cursor-pointer">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-hx-border mb-4" />

        {/* Legal links */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-hx-muted text-xs hover:text-hx-text transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-hx-muted text-xs">
          © 2024–{year}, HEXCORE Inc. or its affiliates
        </p>
      </div>
    </footer>
  )
}
