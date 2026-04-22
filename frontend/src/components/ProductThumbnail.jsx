/** Category-specific SVG icons for product cards */

function KeyboardIcon({ color }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <rect x="6" y="18" width="60" height="36" rx="5" stroke={color} strokeWidth="2"/>
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <rect key={i} x={10+i*5.2} y="24" width="3.5" height="3.5" rx="0.8" fill={color} opacity="0.85"/>
      ))}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <rect key={i} x={12+i*5.2} y="31" width="3.5" height="3.5" rx="0.8" fill={color} opacity="0.7"/>
      ))}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <rect key={i} x={14+i*5.2} y="38" width="3.5" height="3.5" rx="0.8" fill={color} opacity="0.55"/>
      ))}
      <rect x="20" y="45" width="32" height="3.5" rx="1.5" fill={color} opacity="0.9"/>
    </svg>
  )
}

function MouseIcon({ color }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <rect x="24" y="12" width="24" height="42" rx="12" stroke={color} strokeWidth="2"/>
      <line x1="36" y1="12" x2="36" y2="36" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <circle cx="36" cy="26" r="3" fill={color} opacity="0.9"/>
    </svg>
  )
}

function HeadsetIcon({ color }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <path d="M18 38c0-9.9 8.1-18 18-18s18 8.1 18 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <rect x="12" y="36" width="8" height="14" rx="4" stroke={color} strokeWidth="2"/>
      <rect x="52" y="36" width="8" height="14" rx="4" stroke={color} strokeWidth="2"/>
      <line x1="36" y1="50" x2="36" y2="58" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <rect x="30" y="56" width="12" height="4" rx="2" fill={color} opacity="0.8"/>
    </svg>
  )
}

function MonitorIcon({ color }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <rect x="8" y="14" width="56" height="36" rx="4" stroke={color} strokeWidth="2"/>
      <line x1="8" y1="44" x2="64" y2="44" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <line x1="36" y1="50" x2="36" y2="58" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="58" x2="48" y2="58" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="36" cy="47" r="1.5" fill={color} opacity="0.7"/>
    </svg>
  )
}

function HubIcon({ color }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <rect x="16" y="24" width="40" height="24" rx="5" stroke={color} strokeWidth="2"/>
      {[22,29,36,43,50].map((x, i) => (
        <rect key={i} x={x} y="32" width="5" height="8" rx="1.5" fill={color} opacity={0.9 - i*0.1}/>
      ))}
      <line x1="36" y1="48" x2="36" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function WebcamIcon({ color }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="28" r="16" stroke={color} strokeWidth="2"/>
      <circle cx="36" cy="28" r="8" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <circle cx="36" cy="28" r="3" fill={color} opacity="0.9"/>
      <line x1="36" y1="44" x2="36" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="56" x2="48" y2="56" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function AccessoriesIcon({ color }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <polygon points="36,10 44,26 62,26 48,37 54,54 36,44 18,54 24,37 10,26 28,26" stroke={color} strokeWidth="1.5" fill="none"/>
      <polygon points="36,18 42,28 53,28 44,35 48,46 36,38 24,46 28,35 19,28 30,28" fill={color} opacity="0.2"/>
    </svg>
  )
}

const ICONS = {
  keyboards:   KeyboardIcon,
  mice:        MouseIcon,
  headsets:    HeadsetIcon,
  monitors:    MonitorIcon,
  hubs:        HubIcon,
  webcams:     WebcamIcon,
  accessories: AccessoriesIcon,
}

/**
 * Product image area — real photo when image_url is set, SVG icon fallback otherwise.
 */
export default function ProductThumbnail({ category, style, imageUrl, alt }) {
  const Icon = ICONS[category] || AccessoriesIcon
  const color = style?.accent || '#00C6FF'
  const from  = style?.gradFrom || '#061a30'
  const to    = style?.gradTo   || '#030e1a'

  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
    >
      {/* Hex pattern overlay — always present as subtle bg */}
      <div className="absolute inset-0 hex-pattern opacity-20 pointer-events-none" />

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt || category}
          className="relative z-10 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // On broken URL fall back to SVG icon
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling.style.display = 'flex'
          }}
        />
      ) : null}

      {/* SVG icon — shown when no imageUrl or img fails to load */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          filter: `drop-shadow(0 0 14px ${color}55)`,
          display: imageUrl ? 'none' : 'flex',
        }}
      >
        <Icon color={color} />
      </div>
    </div>
  )
}
