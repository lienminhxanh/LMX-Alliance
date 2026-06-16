import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  const navLinks = [
    { href: `/${locale}`, label: nav('home') },
    { href: `/${locale}/about`, label: nav('about') },
    { href: `/${locale}/business-segments`, label: nav('business') },
    { href: `/${locale}/investor-relations`, label: nav('investor') },
    { href: `/${locale}/news`, label: nav('news') },
    { href: `/${locale}/careers`, label: nav('careers') },
    { href: `/${locale}/contact`, label: nav('contact') },
  ];

  return (
    <footer className="bg-[#1F2937] text-white mt-auto">
      <div className="container-max py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-[#1F2937] text-xs font-bold">LMX</span>
              </div>
              <span className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>LMX Alliance</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Công ty Cổ phần Liên Minh Xanh LMX — Tập đoàn đa ngành phát triển bền vững.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-300">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-300">{t('contact')}</h4>
            <ul className="space-y-3">
              <li className="flex gap-2.5 text-sm text-gray-400">
                <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                <span>Số 104 Đường Lò Lu, Phường Long Phước, TP. HCM</span>
              </li>
              <li className="flex gap-2.5 text-sm text-gray-400">
                <Phone size={14} className="flex-shrink-0 mt-0.5" />
                <span>0931.824.025 / 0937.798.377</span>
              </li>
              <li className="flex gap-2.5 text-sm text-gray-400">
                <Mail size={14} className="flex-shrink-0 mt-0.5" />
                <span>Ops@lmxalliance.com</span>
              </li>
              <li className="flex gap-2.5 text-sm text-gray-400">
                <Clock size={14} className="flex-shrink-0 mt-0.5" />
                <span>T2–T7: 7:00 – 17:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500">{t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
