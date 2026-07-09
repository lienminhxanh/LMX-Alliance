'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const localeLabels: Record<string, string> = { vi: 'VI', en: 'EN', zh: '中' };
const locales = ['vi', 'en', 'zh'];

const flags: Record<string, React.ReactNode> = {
  vi: (
    <svg viewBox="0 0 30 20" className="w-5 h-3.5 shadow-sm border border-gray-200 rounded-sm">
      <rect width="30" height="20" fill="#da251d" />
      <polygon points="15,4 16.2,8.5 21,8.5 17.1,11.3 18.6,16 15,13 11.4,16 12.9,11.3 9,8.5 13.8,8.5" fill="#ffff00" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 60 30" className="w-5 h-3.5 shadow-sm border border-gray-200 rounded-sm">
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#s)" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  zh: (
    <svg viewBox="0 0 30 20" className="w-5 h-3.5 shadow-sm border border-gray-200 rounded-sm">
      <rect width="30" height="20" fill="#ee1c25" />
      <polygon points="5,5 5.6,3.2 6.2,5 7.8,5 6.5,6 7,7.8 5.6,6.7 4.2,7.8 4.7,6 3.4,5" fill="#ffde00" />
      <polygon points="10,2 10.2,1.3 10.4,2 11,2 10.5,2.4 10.7,3 10.2,2.6 9.7,3 9.9,2.4 9.4,2" fill="#ffde00" />
      <polygon points="12,4 12.2,3.3 12.4,4 13,4 12.5,4.4 12.7,5 12.2,4.6 11.7,5 11.9,4.4 11.4,4" fill="#ffde00" />
      <polygon points="12,7 12.2,6.3 12.4,7 13,7 12.5,7.4 12.7,8 12.2,7.6 11.7,8 11.9,7.4 11.4,7" fill="#ffde00" />
      <polygon points="10,9 10.2,8.3 10.4,9 11,9 10.5,9.4 10.7,10 10.2,9.6 9.7,10 9.9,9.4 9.4,9" fill="#ffde00" />
    </svg>
  ),
};

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/business-segments`, label: t('business') },
    { href: `/${locale}/shareholder-relations`, label: t('investor') },
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/careers`, label: t('careers') },
    { href: `/${locale}/activities`, label: t('activities') },
  ];

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    window.location.href = segments.join('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: '2px solid #defbbc', boxShadow: '0 2px 12px rgba(1,82,49,0.06)' }}>
      <div className="container-max flex items-center justify-between" style={{ height: '64px' }}>

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center flex-shrink-0">
          <Image
            src="/logo.png"
            alt="LMX Alliance"
            width={320}
            height={120}
            className="object-contain"
            style={{ height: '120px', width: 'auto', maxWidth: '320px', paddingTop: '12px' }}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center">
          {navLinks.map((link) => {
            const isHome = link.href === `/${locale}`;
            const active = isHome
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-5 text-sm transition-colors border-b-2',
                  active
                    ? 'border-[#8ec63f] text-[var(--color-primary-dark)] font-semibold'
                    : 'border-transparent text-[#374151] hover:text-[var(--color-primary-dark)]'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language flags switcher side-by-side */}
          <div className="flex items-center gap-2">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={cn(
                  "p-1 transition-all rounded hover:scale-110",
                  l === locale 
                    ? "border bg-[#f8fbf2] scale-105" 
                    : "border border-transparent opacity-60 hover:opacity-100"
                )}
                style={{
                  borderColor: l === locale ? '#8ec63f' : 'transparent'
                }}
                title={localeLabels[l]}
                aria-label={`Switch language to ${localeLabels[l]}`}
              >
                {flags[l]}
              </button>
            ))}
          </div>

          <Link
            href={`/${locale}/contact`}
            className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-medium transition-all"
            style={{ background: '#8ec63f', color: 'var(--color-primary-mid)', borderRadius: '4px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-dark)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#8ec63f'; e.currentTarget.style.color = 'var(--color-primary-mid)'; }}
          >
            {t('contact')}
          </Link>

          <button
            className="lg:hidden p-2 transition-colors"
            style={{ color: 'var(--color-primary-dark)' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="lg:hidden absolute left-0 right-0 bg-white z-50"
          style={{ top: '64px', borderBottom: '1px solid #defbbc', boxShadow: '0 8px 24px rgba(1,82,49,0.1)' }}
        >
          {[...navLinks, { href: `/${locale}/contact`, label: t('contact') }].map((link) => {
            const isHome = link.href === `/${locale}`;
            const active = isHome
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-6 py-3.5 text-sm transition-colors"
                style={{
                  color: active ? 'var(--color-primary-dark)' : '#374151',
                  fontWeight: active ? 600 : 400,
                  borderBottom: '1px solid #f8fbf2',
                  borderLeft: active ? '3px solid #8ec63f' : '3px solid transparent',
                  background: active ? '#f8fbf2' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
