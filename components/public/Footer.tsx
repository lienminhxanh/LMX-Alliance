import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Phone, Mail, Clock, Leaf } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  const navLinks = [
    { href: `/${locale}`, label: nav('home') },
    { href: `/${locale}/about`, label: nav('about') },
    { href: `/${locale}/business-segments`, label: nav('business') },
    { href: `/${locale}/shareholder-relations`, label: nav('investor') },
    { href: `/${locale}/news`, label: nav('news') },
    { href: `/${locale}/careers`, label: nav('careers') },
    { href: `/${locale}/activities`, label: nav('activities') },
    { href: `/${locale}/contact`, label: nav('contact') },
  ];

  return (
    <footer className="mt-auto text-white relative overflow-hidden" style={{ background: '#015231' }}>
      {/* subtle leaf bg decoration */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <svg width="220" height="220" viewBox="0 0 32 32" fill="none" style={{ position: 'absolute', right: '-60px', bottom: '-60px', opacity: 0.06 }}>
          <path d="M16 2 C10 5, 4 11, 5 18 C6 24, 10 28, 16 30 C22 28, 26 24, 27 18 C28 11, 22 5, 16 2Z" fill="#78d750"/>
        </svg>
        <svg width="140" height="140" viewBox="0 0 32 32" fill="none" style={{ position: 'absolute', left: '-30px', top: '-30px', opacity: 0.05 }}>
          <path d="M16 2 C10 5, 4 11, 5 18 C6 24, 10 28, 16 30 C22 28, 26 24, 27 18 C28 11, 22 5, 16 2Z" fill="#78d750"/>
        </svg>
      </div>

      <div className="container-max py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="inline-block mb-4">
              <Image
                src="/logo.jpg"
                alt="LMX Alliance"
                width={130}
                height={52}
                className="object-contain brightness-0 invert"
                style={{ height: '44px', width: 'auto', maxWidth: '130px' }}
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: '#defbbc' }}>
              Công ty Cổ phần Liên Minh Xanh LMX — Tập đoàn đa ngành phát triển bền vững.
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#8ec63f' }}>
              <Leaf size={12} />
              <span>Xanh — Sạch — Bền vững</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5 text-white">{t('quickLinks')}</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white flex items-center gap-1"
                    style={{ color: '#defbbc' }}
                  >
                    <span style={{ color: '#8ec63f', fontSize: '0.6rem' }}>▶</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5 text-white">{t('contact')}</h4>
            <ul className="space-y-3">
              <li className="flex gap-2.5 text-sm" style={{ color: '#defbbc' }}>
                <MapPin size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#8ec63f' }} />
                <span>Số 104 Đường Lò Lu, Phường Long Phước, TP. HCM</span>
              </li>
              <li className="flex gap-2.5 text-sm" style={{ color: '#defbbc' }}>
                <Phone size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#8ec63f' }} />
                <span>0931.824.025 / 0937.798.377</span>
              </li>
              <li className="flex gap-2.5 text-sm" style={{ color: '#defbbc' }}>
                <Mail size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#8ec63f' }} />
                <span>Ops@lmxalliance.com</span>
              </li>
              <li className="flex gap-2.5 text-sm" style={{ color: '#defbbc' }}>
                <Clock size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#8ec63f' }} />
                <span>T2–T7: 7:00 – 17:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(142,198,63,0.25)' }}>
          <p className="text-xs" style={{ color: '#defbbc' }}>{t('rights')}</p>
          <p className="text-xs flex items-center gap-1" style={{ color: '#8ec63f' }}>
            <Leaf size={10} /> Phát triển bền vững từ năm 2015
          </p>
        </div>
      </div>
    </footer>
  );
}
