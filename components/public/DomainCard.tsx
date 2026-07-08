import { LucideIcon, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AnimateIn } from '@/components/ui/AnimateIn';

// Not yet wired into any page — intentionally deferred past Phase 3 (see docs/superpowers/plans/2026-07-06-phase3-featured-projects.md, "Deferred scope"), not dead by oversight.
interface DomainCardProps {
  icon: LucideIcon;
  image?: string | null;
  title: string;
  summary: string;
  href: string;
  delay?: number;
  className?: string;
}

export function DomainCard({ icon: Icon, image, title, summary, href, delay = 0, className }: DomainCardProps) {
  return (
    <AnimateIn delay={delay} className={className}>
      <Link
        href={href}
        className="card-lift bg-white h-full flex flex-col group cursor-pointer border block"
        style={{ borderColor: 'var(--color-lime-pale)', borderRadius: '4px', overflow: 'hidden' }}
        aria-label={title}
      >
        <div className="relative">
          {image && (
            <div className="relative w-full aspect-[16/10] overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          )}
          <div
            className="absolute left-6 flex items-center justify-center w-14 h-14 bg-white shadow-md"
            style={{ bottom: image ? '-28px' : undefined, top: image ? undefined : '16px', borderRadius: '4px' }}
          >
            <Icon size={26} style={{ color: 'var(--color-primary)' }} strokeWidth={1.5} />
          </div>
        </div>
        <div className={cn('p-8 flex-1 flex flex-col', image && 'pt-10')}>
          <h3 className="text-base font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--color-neutral-dark)' }}>
            {summary}
          </p>
          <span
            className="inline-flex items-center gap-1.5 text-sm font-medium link-underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Xem thêm <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </AnimateIn>
  );
}
