'use client';
import Link from 'next/link';
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
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    window.location.href = segments.join('/');
    setLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white" style={{ height: '56px', borderBottom: '1px solid #E8E9ED' }}>
      <div className="container-max h-full flex items-center justify-between">

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 flex items-center justify-center" style={{ background: '#047857' }}>
            <span className="text-white text-xs font-bold">LMX</span>
          </div>
          <span className="text-sm font-semibold hidden sm:block" style={{ color: '#064e3b', fontFamily: 'var(--font-display)' }}>
            LMX Alliance
          </span>
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
                  'px-3 py-4 text-sm transition-colors border-b-2',
                  active
                    ? 'border-[#047857] text-[#047857] font-medium'
                    : 'border-transparent text-[#374151] hover:text-[#047857]'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2 py-1.5 text-sm transition-colors"
              style={{ color: '#6B7280' }}
            >
              <Globe size={14} />
              <span>{localeLabels[locale]}</span>
            </button>
            {langOpen && (
              <div
                className="absolute right-0 top-full mt-1 bg-white w-20 z-50"
                style={{ border: '1px solid #E8E9ED', borderRadius: '2px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              >
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[#f0fdf4]"
                    style={{ color: l === locale ? '#047857' : '#6B7280', fontWeight: l === locale ? 600 : 400 }}
                  >
                    {localeLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/contact`}
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ background: '#047857', borderRadius: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = '#065f46')}
            onMouseLeave={e => (e.currentTarget.style.background = '#047857')}
          >
            {t('contact')}
          </Link>

          <button
            className="lg:hidden p-2 transition-colors"
            style={{ color: '#6B7280' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-white z-50" style={{ borderBottom: '1px solid #E8E9ED' }}>
          {navLinks.map((link) => {
            const isHome = link.href === `/${locale}`;
            const active = isHome
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-sm transition-colors"
                style={{
                  color: active ? '#047857' : '#374151',
                  fontWeight: active ? 600 : 400,
                  borderBottom: '1px solid #F5F6F8',
                  borderLeft: active ? '3px solid #047857' : '3px solid transparent',
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
