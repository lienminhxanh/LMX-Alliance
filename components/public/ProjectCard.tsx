import Image from 'next/image';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/AnimateIn';

interface ProjectCardProps {
  image?: string | null;
  statusLabel: string;
  name: string;
  scale?: string;
  location?: string;
  scaleLabel?: string;
  locationLabel?: string;
  href: string;
  delay?: number;
  className?: string;
}

export function ProjectCard({ 
  image, 
  statusLabel, 
  name, 
  scale, 
  location, 
  scaleLabel = 'Quy mô:', 
  locationLabel = 'Vị trí:', 
  href, 
  delay = 0, 
  className 
}: ProjectCardProps) {
  const hasMeta = Boolean(scale || location);

  return (
    <AnimateIn delay={delay} className={className}>
      <Link
        href={href}
        className="flex flex-col md:flex-row gap-6 md:gap-8 group cursor-pointer items-start"
        aria-label={name}
      >
        {/* Left Side: Content */}
        <div className="flex-1 flex flex-col order-2 md:order-1 mt-2 md:mt-0">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">
            {statusLabel}
          </span>
          <h3 className="text-[14px] font-bold uppercase mb-3 leading-snug group-hover:opacity-80 transition-opacity" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
            {name}
          </h3>
          
          {hasMeta && (
            <div className="flex flex-col gap-2 text-[12px] text-gray-800">
              {scale && (
                <div className="flex items-start gap-3">
                  <span className="font-bold min-w-[60px]">{scaleLabel}</span>
                  <span className="flex-1">{scale}</span>
                </div>
              )}
              {location && (
                <div className="flex items-start gap-3">
                  <span className="font-bold min-w-[60px]">{locationLabel}</span>
                  <span className="flex-1">{location}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Image */}
        {image && (
          <div className="w-full md:w-[50%] aspect-[4/3] relative overflow-hidden rounded-md order-1 md:order-2 flex-shrink-0" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </Link>
    </AnimateIn>
  );
}
