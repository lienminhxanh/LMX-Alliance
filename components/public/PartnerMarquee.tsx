import { prisma } from '@/lib/prisma';
import { getLocale } from 'next-intl/server';
import { AnimateIn } from '@/components/ui/AnimateIn';

function PartnerLogoFallback({ name }: { name: string }) {
  const initial = name ? name.charAt(0).toUpperCase() : 'P';
  return (
    <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-[#327b36] to-[var(--color-primary-dark)] rounded-[4px] shadow-sm flex-shrink-0">
      <span className="text-white font-bold text-lg">{initial}</span>
    </div>
  );
}

export async function PartnerMarquee() {
  const locale = await getLocale();
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';
  
  const partners = await prisma.partner.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  if (partners.length === 0) return null;

  return (
    <section className="py-8 bg-white border-t" style={{ borderColor: 'rgba(1, 82, 49, 0.08)' }}>
      <div className="container-max">
        <div className="text-center mb-8">
          <AnimateIn>
            <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-wide" style={{ color: 'var(--color-primary-dark)', fontFamily: 'var(--font-display)' }}>
              {locale === 'vi' ? 'Đối tác chiến lược' : locale === 'en' ? 'Strategic Partners' : '战略合作伙伴'}
            </h2>
            <div className="w-10 h-[3px] bg-[#8ec63f] mx-auto mt-2 rounded-full" />
          </AnimateIn>
        </div>
        
        <AnimateIn delay={0.1}>
          {partners.length === 1 ? (
            <div className="flex justify-center items-center">
              <div className="px-8 transition-transform duration-300 hover:scale-105">
                {partners[0].logo ? (
                  <img
                    src={partners[0].logo}
                    alt={(partners[0] as any)[`name${L}`] || partners[0].nameVI}
                    className="h-10 md:h-12 w-auto object-contain"
                  />
                ) : (
                  <PartnerLogoFallback name={(partners[0] as any)[`name${L}`] || partners[0].nameVI} />
                )}
              </div>
            </div>
          ) : (
            <div className="marquee-wrapper">
              <div className="marquee-track">
                {/* Multiply by 6 to ensure it's wide enough. Marquee scrolls 50% (3 sets). */}
                {[...partners, ...partners, ...partners, ...partners, ...partners, ...partners].map((p, i) => (
                  <div key={`${p.id}-${i}`} className="marquee-item px-6 md:px-10 transition-transform duration-300 hover:scale-105 flex items-center justify-center">
                    {p.logo ? (
                      <img
                        src={p.logo}
                        alt={(p as any)[`name${L}`] || p.nameVI}
                        className="h-10 md:h-12 w-auto object-contain"
                      />
                    ) : (
                      <PartnerLogoFallback name={(p as any)[`name${L}`] || p.nameVI} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </AnimateIn>
      </div>
    </section>
  );
}
