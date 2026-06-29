'use client';

export type LeafVariant = 'leaf' | 'eco' | 'branch' | 'mixed';

interface ElemConfig {
  x: string; y: string; size: number; delay: string; duration: string;
  opacity: number; rotate: number; anim: string; type: string;
}

/* ── Leaf: organic pointed leaves ────────────── */
function LeafSvg({ size, rotate, color }: { size: number; rotate: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}>
      {/* Main leaf blade */}
      <path
        d="M16 2 C10 5, 4 11, 5 18 C6 24, 10 28, 16 30 C22 28, 26 24, 27 18 C28 11, 22 5, 16 2Z"
        fill={color}
      />
      {/* Midrib */}
      <path d="M16 3 C15.5 12, 15.8 22, 16 29" stroke="rgba(0,80,0,0.25)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      {/* Side veins */}
      <path d="M16 12 C12 10, 8 11, 7 14 M16 17 C12 15, 9 16, 8 19 M16 12 C20 10, 24 11, 25 14 M16 17 C20 15, 23 16, 24 19"
        stroke="rgba(0,80,0,0.15)" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Eco: recycling arrow circle ─────────────── */
function EcoSvg({ size, rotate, color }: { size: number; rotate: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}>
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8H2l3.84 3.84.07.14L10 12H7c0-2.76 2.24-5 5-5 1.38 0 2.62.56 3.53 1.47L17.65 6.35zM14 12h3c0 2.76-2.24 5-5 5-1.38 0-2.62-.56-3.53-1.47L6.35 17.65C7.8 19.1 9.79 20 12 20c4.42 0 8-3.58 8-8h2l-4-4-4 4z"/>
    </svg>
  );
}

/* ── Branch: small 3-leaf branch ─────────────── */
function BranchSvg({ size, rotate, color }: { size: number; rotate: number; color: string }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 28 40" fill="none"
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}>
      {/* Stem */}
      <path d="M14 38 C14 30, 14 22, 14 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* Left branch */}
      <path d="M14 20 C10 16, 6 14, 4 10" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      {/* Right branch */}
      <path d="M14 16 C18 12, 22 10, 24 6" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      {/* Top leaf */}
      <ellipse cx="14" cy="8" rx="5" ry="7" fill={color} transform="rotate(-5 14 8)"/>
      {/* Left leaf */}
      <ellipse cx="5" cy="7" rx="4" ry="6" fill={color} transform="rotate(-40 5 7)"/>
      {/* Right leaf */}
      <ellipse cx="23" cy="4" rx="4" ry="6" fill={color} transform="rotate(30 23 4)"/>
    </svg>
  );
}

/* ── Flower: 5-petal outline flower ──────────── */
function FlowerSvg({ size, rotate, color }: { size: number; rotate: number; color: string }) {
  const angles = [0, 72, 144, 216, 288];
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}>
      {angles.map((angle, i) => (
        <ellipse
          key={i}
          cx="16" cy="9" rx="3.5" ry="6.5"
          stroke={color} strokeWidth="0.9" fill="none"
          transform={`rotate(${angle} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="2.5" stroke={color} strokeWidth="0.8" fill="none"/>
    </svg>
  );
}

/* ── Sprout: small seedling/sprout ───────────── */
function SproutSvg({ size, rotate, color }: { size: number; rotate: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}>
      <path d="M12 22V13M12 13C12 13 8 12 6 8 6 8 10 7 12 13M12 13C12 13 16 11 18 7 18 7 14 7 12 13"/>
      <rect x="11" y="20" width="2" height="3" rx="1" fill={color}/>
    </svg>
  );
}

/* ── Element configs per variant ─────────────── */
const LEAF_ELEMENTS: ElemConfig[] = [
  { x: '5%',  y: '12%', size: 32, delay: '0s',   duration: '7s',  opacity: 0.22, rotate: -25, anim: 'leaf-float', type: 'leaf' },
  { x: '88%', y: '18%', size: 24, delay: '1.4s', duration: '8s',  opacity: 0.16, rotate: 40,  anim: 'leaf-sway',  type: 'leaf' },
  { x: '12%', y: '58%', size: 20, delay: '2.6s', duration: '6s',  opacity: 0.14, rotate: 15,  anim: 'leaf-drift', type: 'leaf' },
  { x: '78%', y: '52%', size: 36, delay: '0.9s', duration: '9s',  opacity: 0.18, rotate: -50, anim: 'leaf-float', type: 'leaf' },
  { x: '48%', y: '8%',  size: 16, delay: '3.2s', duration: '7s',  opacity: 0.12, rotate: 65,  anim: 'leaf-sway',  type: 'leaf' },
  { x: '93%', y: '68%', size: 22, delay: '2.0s', duration: '8.5s',opacity: 0.15, rotate: -20, anim: 'leaf-drift', type: 'leaf' },
  { x: '28%', y: '82%', size: 28, delay: '0.5s', duration: '10s', opacity: 0.13, rotate: 30,  anim: 'leaf-float', type: 'leaf' },
  { x: '62%', y: '88%', size: 18, delay: '2.2s', duration: '6s',  opacity: 0.10, rotate: -60, anim: 'leaf-sway',  type: 'leaf' },
];

const ECO_ELEMENTS: ElemConfig[] = [
  { x: '8%',  y: '15%', size: 28, delay: '0s',   duration: '8s',  opacity: 0.18, rotate: 0,  anim: 'leaf-sway',  type: 'eco' },
  { x: '82%', y: '22%', size: 20, delay: '1.5s', duration: '9s',  opacity: 0.13, rotate: 30, anim: 'leaf-float', type: 'eco' },
  { x: '15%', y: '65%', size: 24, delay: '2.8s', duration: '7s',  opacity: 0.15, rotate: -15,anim: 'leaf-drift', type: 'eco' },
  { x: '75%', y: '60%', size: 32, delay: '1.0s', duration: '10s', opacity: 0.14, rotate: 45, anim: 'leaf-sway',  type: 'eco' },
  { x: '50%', y: '10%', size: 16, delay: '3.5s', duration: '8s',  opacity: 0.10, rotate: -30,anim: 'leaf-float', type: 'eco' },
  { x: '90%', y: '72%', size: 22, delay: '2.0s', duration: '9s',  opacity: 0.12, rotate: 15, anim: 'leaf-drift', type: 'eco' },
  /* Also sprinkle small leaves */
  { x: '35%', y: '78%', size: 22, delay: '0.7s', duration: '7.5s',opacity: 0.13, rotate: 20,anim: 'leaf-float', type: 'leaf' },
  { x: '68%', y: '85%', size: 16, delay: '2.4s', duration: '6.5s',opacity: 0.10, rotate:-40, anim: 'leaf-sway',  type: 'leaf' },
];

const BRANCH_ELEMENTS: ElemConfig[] = [
  { x: '3%',  y: '10%', size: 32, delay: '0s',   duration: '7s',  opacity: 0.20, rotate: -10, anim: 'leaf-sway',  type: 'branch' },
  { x: '84%', y: '15%', size: 24, delay: '1.8s', duration: '9s',  opacity: 0.15, rotate: 20,  anim: 'leaf-float', type: 'branch' },
  { x: '10%', y: '62%', size: 28, delay: '3.0s', duration: '8s',  opacity: 0.16, rotate: -5,  anim: 'leaf-drift', type: 'branch' },
  { x: '78%', y: '55%', size: 36, delay: '1.2s', duration: '10s', opacity: 0.18, rotate: 15,  anim: 'leaf-sway',  type: 'branch' },
  { x: '46%', y: '5%',  size: 20, delay: '2.5s', duration: '7s',  opacity: 0.12, rotate: -20, anim: 'leaf-float', type: 'branch' },
  { x: '91%', y: '70%', size: 22, delay: '0.6s', duration: '9.5s',opacity: 0.14, rotate: 10,  anim: 'leaf-drift', type: 'branch' },
  { x: '30%', y: '80%', size: 26, delay: '2.0s', duration: '8s',  opacity: 0.13, rotate: -15, anim: 'leaf-sway',  type: 'branch' },
  { x: '60%', y: '88%', size: 18, delay: '1.4s', duration: '6.5s',opacity: 0.11, rotate: 25,  anim: 'leaf-float', type: 'branch' },
];

const MIXED_ELEMENTS: ElemConfig[] = [
  /* Left / center */
  { x: '5%',  y: '10%', size: 30, delay: '0s',   duration: '7s',   opacity: 0.20, rotate: -20, anim: 'leaf-float', type: 'leaf' },
  { x: '14%', y: '55%', size: 26, delay: '2.5s', duration: '7s',   opacity: 0.16, rotate: 10,  anim: 'leaf-drift', type: 'branch' },
  { x: '28%', y: '82%', size: 24, delay: '0.4s', duration: '9.5s', opacity: 0.14, rotate: 28,  anim: 'leaf-float', type: 'leaf' },
  { x: '38%', y: '30%', size: 18, delay: '1.6s', duration: '7s',   opacity: 0.10, rotate: -30, anim: 'leaf-float', type: 'leaf' },
  { x: '45%', y: '8%',  size: 24, delay: '3.0s', duration: '8s',   opacity: 0.13, rotate: 60,  anim: 'leaf-sway',  type: 'flower' },
  { x: '55%', y: '50%', size: 22, delay: '4.0s', duration: '8s',   opacity: 0.10, rotate: 12,  anim: 'leaf-drift', type: 'branch' },
  /* Right side – bigger & denser to replace circles */
  { x: '86%', y: '4%',  size: 64, delay: '0.2s', duration: '7.5s', opacity: 0.20, rotate: 20,  anim: 'leaf-float', type: 'flower' },
  { x: '71%', y: '16%', size: 48, delay: '1.3s', duration: '8.5s', opacity: 0.18, rotate: 35,  anim: 'leaf-sway',  type: 'leaf' },
  { x: '83%', y: '33%', size: 56, delay: '2.8s', duration: '9s',   opacity: 0.16, rotate: -15, anim: 'leaf-drift', type: 'flower' },
  { x: '67%', y: '50%', size: 68, delay: '1.0s', duration: '9s',   opacity: 0.15, rotate: -45, anim: 'leaf-float', type: 'leaf' },
  { x: '89%', y: '46%', size: 40, delay: '1.8s', duration: '7.5s', opacity: 0.15, rotate: -18, anim: 'leaf-drift', type: 'branch' },
  { x: '74%', y: '68%', size: 52, delay: '2.2s', duration: '6.5s', opacity: 0.13, rotate: -55, anim: 'leaf-sway',  type: 'flower' },
  { x: '91%', y: '70%', size: 32, delay: '3.5s', duration: '8s',   opacity: 0.12, rotate: 30,  anim: 'leaf-float', type: 'leaf' },
  { x: '62%', y: '80%', size: 36, delay: '0.8s', duration: '7s',   opacity: 0.11, rotate: 15,  anim: 'leaf-sway',  type: 'branch' },
];

const VARIANT_MAP: Record<LeafVariant, ElemConfig[]> = {
  leaf: LEAF_ELEMENTS,
  eco: ECO_ELEMENTS,
  branch: BRANCH_ELEMENTS,
  mixed: MIXED_ELEMENTS,
};

function ElemSvg({ config, color }: { config: ElemConfig; color: string }) {
  if (config.type === 'eco') return <EcoSvg size={config.size} rotate={config.rotate} color={color} />;
  if (config.type === 'branch') return <BranchSvg size={config.size} rotate={config.rotate} color={color} />;
  if (config.type === 'flower') return <FlowerSvg size={config.size} rotate={config.rotate} color={color} />;
  return <LeafSvg size={config.size} rotate={config.rotate} color={color} />;
}

interface LeafDecorProps {
  variant?: LeafVariant;
  count?: number;
  color?: string;
  className?: string;
}

export function LeafDecor({ variant = 'leaf', count = 8, color = '#78d750', className = '' }: LeafDecorProps) {
  const pool = VARIANT_MAP[variant] ?? LEAF_ELEMENTS;
  const elems = pool.slice(0, count);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {elems.map((el, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: el.x,
            top: el.y,
            opacity: el.opacity,
            animation: `${el.anim} ${el.duration} ${el.delay} ease-in-out infinite`,
          }}
        >
          <ElemSvg config={el} color={color} />
        </div>
      ))}
    </div>
  );
}
