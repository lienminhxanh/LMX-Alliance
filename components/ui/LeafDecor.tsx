'use client';

interface Leaf {
  x: string;
  y: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
  rotate: number;
  anim: string;
}

const LEAVES: Leaf[] = [
  { x: '8%',  y: '15%', size: 28, delay: '0s',    duration: '6s',  opacity: 0.18, rotate: -20, anim: 'leaf-float' },
  { x: '85%', y: '20%', size: 22, delay: '1.2s',  duration: '7s',  opacity: 0.14, rotate: 35,  anim: 'leaf-sway' },
  { x: '15%', y: '60%', size: 18, delay: '2.4s',  duration: '5s',  opacity: 0.12, rotate: 10,  anim: 'leaf-drift' },
  { x: '75%', y: '55%', size: 32, delay: '0.8s',  duration: '8s',  opacity: 0.16, rotate: -45, anim: 'leaf-float' },
  { x: '50%', y: '10%', size: 14, delay: '3s',    duration: '6.5s',opacity: 0.10, rotate: 60,  anim: 'leaf-sway' },
  { x: '92%', y: '70%', size: 20, delay: '1.8s',  duration: '7.5s',opacity: 0.13, rotate: -15, anim: 'leaf-drift' },
  { x: '30%', y: '80%', size: 24, delay: '0.4s',  duration: '9s',  opacity: 0.11, rotate: 25,  anim: 'leaf-float' },
  { x: '65%', y: '85%', size: 16, delay: '2s',    duration: '5.5s',opacity: 0.09, rotate: -55, anim: 'leaf-sway' },
];

function LeafSvg({ size, rotate, color = '#a8cc28' }: { size: number; rotate: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 19.15L5.71 21l1-.91C7.39 19.41 8.1 19 9 19c2 0 2 2 4 2s2-2 4-2 2 2 4 2v-2c-1 0-1.5-.5-2-1-1-1-1.5-2.5-3-2.5-1 0-1.33.33-2 1-.67.67-1 1.5-2 1.5-1 0-1.5-.5-2-1A12.5 12.5 0 0 1 17 8z" />
    </svg>
  );
}

interface LeafDecorProps {
  count?: number;
  color?: string;
  className?: string;
}

export function LeafDecor({ count = 8, color = '#a8cc28', className = '' }: LeafDecorProps) {
  const leaves = LEAVES.slice(0, count);
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`} aria-hidden>
      {leaves.map((leaf, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: leaf.x,
            top: leaf.y,
            opacity: leaf.opacity,
            animation: `${leaf.anim} ${leaf.duration} ${leaf.delay} ease-in-out infinite`,
          }}
        >
          <LeafSvg size={leaf.size} rotate={leaf.rotate} color={color} />
        </div>
      ))}
    </div>
  );
}
