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

  // Split numeric and non-numeric suffix
  const match = displayed.match(/^([\d,.]+)(.*)$/);
  const numPart = match ? match[1] : displayed;
  const suffixPart = match ? match[2] : '';

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white" style={{ fontFamily: 'var(--font-display)' }}>
        <span>{numPart}</span>
        {suffixPart && <span className="text-[#8ec63f] ml-1">{suffixPart}</span>}
      </div>
      <div className="text-xs md:text-sm uppercase tracking-wider text-gray-300 font-medium">{label}</div>
    </div>
  );
}
