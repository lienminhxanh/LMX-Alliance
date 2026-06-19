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

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

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
    setLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: '2px solid #defbbc', boxShadow: '0 2px 12px rgba(1,82,49,0.06)' }}>
      <div className="container-max flex items-center justify-between" style={{ height: '64px' }}>

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center flex-shrink-0">
          <Image
            src="/logo.jpg"
            alt="LMX Alliance"
            width={180}
            height={64}
            className="object-contain"
            style={{ height: '54px', width: 'auto', maxWidth: '180px' }}
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
                    ? 'border-[#8ec63f] text-[#015231] font-semibold'
                    : 'border-transparent text-[#374151] hover:text-[#8ec63f]'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => { setLangOpen(!langOpen); if (menuOpen) setMenuOpen(false); }}
              className="flex items-center gap-1.5 px-2 py-1.5 text-sm transition-colors rounded"
              style={{ color: '#6B7280' }}
            >
              <Globe size={14} />
              <span>{localeLabels[locale]}</span>
            </button>
            {langOpen && (
              <div
                className="absolute right-0 top-full mt-1 bg-white w-20 z-50"
                style={{ border: '1px solid #defbbc', borderRadius: '8px', boxShadow: '0 4px 16px rgba(1,82,49,0.1)' }}
              >
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className="w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg"
                    style={{
                      color: l === locale ? '#8ec63f' : '#6B7280',
                      fontWeight: l === locale ? 600 : 400,
                      background: l === locale ? '#f8fbf2' : 'transparent'
                    }}
                  >
                    {localeLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/contact`}
            className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-medium text-white transition-all"
            style={{ background: '#8ec63f', borderRadius: '9999px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#015231')}
            onMouseLeave={e => (e.currentTarget.style.background = '#8ec63f')}
          >
            {t('contact')}
          </Link>

          <button
            className="lg:hidden p-2 transition-colors"
            style={{ color: '#015231' }}
            onClick={() => { setMenuOpen(!menuOpen); if (langOpen) setLangOpen(false); }}
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
                  color: active ? '#8ec63f' : '#374151',
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
