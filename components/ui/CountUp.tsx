'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export function CountUp({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayed, setDisplayed] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    const suffix = value.replace(/[0-9.]/g, '');
    if (isNaN(num)) { setDisplayed(value); return; }

    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = num / (duration / step);
    const timer = setInterval(() => {
      start = Math.min(start + increment, num);
      setDisplayed(Math.floor(start) + suffix);
      if (start >= num) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref}>
      <div className="text-4xl font-bold mb-1 text-white" style={{ fontFamily: 'var(--font-mono)' }}>
        {displayed}
      </div>
      <div className="text-sm" style={{ color: '#a7f3d0' }}>{label}</div>
    </div>
  );
}
