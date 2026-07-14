'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { HashScrollHandler } from '@/components/public/HashScrollHandler';

interface ActivityItem {
  image: string;
  title: string;
  desc: string;
}

interface ActivitySliderProps {
  title: string;
  items: ActivityItem[];
  locale: string;
  id?: string;
}

function ActivitySlider({ title, items, locale, id }: ActivitySliderProps) {
  const [page, setPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const totalPages = Math.ceil(items.length / 3);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, totalPages]);

  const handlePrev = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <div
      id={id}
      className="relative group py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-center mb-8 border-b pb-4" style={{ borderColor: '#defbbc' }}>
        <h2 className="text-xl md:text-2xl font-bold text-[#015231] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h2>
      </div>

      <div className="relative px-2 md:px-0">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 -left-2 md:-left-6 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#015231] hover:bg-[#015231] hover:text-white transition-all z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 pointer-events-auto"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={handleNext}
          className="absolute top-1/2 -right-2 md:-right-6 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#015231] hover:bg-[#015231] hover:text-white transition-all z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 pointer-events-auto"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Sliding Viewport */}
        <div className="overflow-hidden w-full">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {/* Slide groups of 3 */}
            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              const slideItems = items.slice(pageIdx * 3, pageIdx * 3 + 3);
              return (
                <div key={pageIdx} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {slideItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-gray-100 flex flex-col justify-between transition-all hover:shadow-lg h-full group/card"
                      style={{ borderRadius: '4px', overflow: 'hidden' }}
                    >
                      <div>
                        {/* Image wrapper */}
                        <div className="relative h-[200px] w-full overflow-hidden bg-gray-50">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="p-5">
                          <h3 className="text-sm md:text-base font-bold text-[#015231] mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-display)', minHeight: '3rem' }}>
                            {item.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* Footer link */}
                      <div className="p-5 pt-0">
                        <span 
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8ec63f] group-hover/card:text-[#015231] transition-colors"
                        >
                          {locale === 'vi' ? 'Xem thêm' : locale === 'en' ? 'Read more' : '查看更多'}
                          <ArrowRight size={12} className="transition-transform group-hover/card:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActivitiesClientProps {
  locale: string;
  internalTitle: string;
  socialTitle: string;
  internalItems: ActivityItem[];
  socialItems: ActivityItem[];
}

export default function ActivitiesClient({
  locale,
  internalTitle,
  socialTitle,
  internalItems,
  socialItems,
}: ActivitiesClientProps) {
  return (
    <div className="space-y-16">
      <HashScrollHandler />
      {/* Internal Activities Slider */}
      <AnimateIn>
        <ActivitySlider title={internalTitle} items={internalItems} locale={locale} id="internal-activities" />
      </AnimateIn>

      {/* Social Activities Slider */}
      <AnimateIn delay={0.1}>
        <ActivitySlider title={socialTitle} items={socialItems} locale={locale} id="social-activities" />
      </AnimateIn>
    </div>
  );
}
