import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Ruler } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';

interface ProjectCardProps {
  image?: string | null;
  status: 'ONGOING' | 'COMPLETED' | 'ARCHIVED';
  name: string;
  scale?: string;
  location?: string;
  href: string;
  delay?: number;
  className?: string;
}

const statusLabel: Record<ProjectCardProps['status'], string> = {
  ONGOING: 'Đang triển khai',
  COMPLETED: 'Hoàn thành',
  ARCHIVED: 'Lưu trữ',
};

export function ProjectCard({ image, status, name, scale, location, href, delay = 0, className }: ProjectCardProps) {
  const hasMeta = Boolean(scale || location);

  return (
    <AnimateIn delay={delay} className={className}>
      <Link
        href={href}
        className="card-lift bg-white h-full flex flex-col group cursor-pointer border block"
        style={{ borderColor: 'var(--color-lime-pale)', borderRadius: '4px', overflow: 'hidden' }}
        aria-label={name}
      >
        {image && (
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <span
            className="inline-flex self-start items-center px-2 py-0.5 text-xs font-medium mb-3"
            style={{ background: 'var(--color-lime-pale)', color: 'var(--color-primary-dark)', borderRadius: '4px' }}
          >
            {statusLabel[status]}
          </span>
          <h3 className="text-base font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            {name}
          </h3>
          {hasMeta && (
            <div className="mt-auto pt-3 flex flex-col gap-1.5 text-sm" style={{ color: 'var(--color-neutral-dark)' }}>
              {scale && (
                <span className="inline-flex items-center gap-1.5">
                  <Ruler size={14} style={{ color: 'var(--color-primary)' }} />
                  {scale}
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                  {location}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </AnimateIn>
  );
}
