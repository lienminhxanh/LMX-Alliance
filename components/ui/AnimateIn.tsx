'use client';
import { motion, useReducedMotion } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offsets: Record<Direction, { x: number; y: number }> = {
  up:    { x: 0,   y: 24 },
  down:  { x: 0,   y: -24 },
  left:  { x: -28, y: 0 },
  right: { x: 28,  y: 0 },
  none:  { x: 0,   y: 0 },
};

export function AnimateIn({
  children,
  delay = 0,
  from = 'up',
  scale = false,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: Direction;
  scale?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { x, y } = reduced ? offsets.none : offsets[from];

  return (
    <motion.div
      initial={{ opacity: 0, x, y, scale: scale && !reduced ? 0.97 : 1 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
