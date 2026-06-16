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
    { href: `/${locale}/investor-relations`, label: t('investor') },
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
    <header className="sticky top-0 z-40 bg-white border-b border-[#E8E9ED]" style={{ height: '56px' }}>
      <div className="container-max h-full flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-[#1F2937] flex items-center justify-center">
            <span className="text-white text-xs font-bold">LMX</span>
          </div>
          <span className="text-sm font-semibold text-[#1F2937] hidden sm:block" style={{ fontFamily: 'var(--font-display)' }}>
            LMX Alliance
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-4 text-sm transition-colors border-b-2',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'border-[#1F2937] text-[#1F2937]'
                  : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              <Globe size={14} />
              <span>{localeLabels[locale]}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#E8E9ED] w-20" style={{ borderRadius: '2px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm hover:bg-[#F5F6F8] transition-colors',
                      l === locale ? 'text-[#1F2937] font-medium' : 'text-[#6B7280]'
                    )}
                  >
                    {localeLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/contact`}
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm text-white bg-[#1F2937] hover:bg-[#374151] transition-colors"
            style={{ borderRadius: 0 }}
          >
            {t('contact')}
          </Link>

          {/* Mobile menu */}
          <button
            className="lg:hidden p-2 text-[#6B7280] hover:text-[#1F2937]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-white border-b border-[#E8E9ED] z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-sm text-[#6B7280] hover:text-[#1F2937] border-b border-[#F5F6F8]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
