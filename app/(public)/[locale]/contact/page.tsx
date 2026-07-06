import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';
import { ContactForm } from './ContactForm';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = { vi: 'Liên hệ', en: 'Contact', zh: '联系我们' };
  const descs: Record<string, string> = {
    vi: 'Liên hệ với LMX Alliance — Số 104 Đường Lò Lu, Long Phước, TP.HCM. Hotline: 0931.824.025 / 0937.798.377.',
    en: 'Contact LMX Alliance — 104 Lo Lu Street, Long Phuoc, Ho Chi Minh City. Hotline: 0931.824.025 / 0937.798.377.',
    zh: '联系LMX Alliance — 胡志明市Long Phước区罗炉路104号。热线：0931.824.025 / 0937.798.377。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/contact`,
    alternates: { vi: '/vi/contact', en: '/en/contact', zh: '/zh/contact' },
  });
}

const contactInfo = [
  { icon: MapPin, label: { vi: 'Địa chỉ', en: 'Address', zh: '地址' }, value: 'Số 104 Đường Lò Lu, Phường Long Phước, TP. HCM' },
  { icon: Phone, label: { vi: 'Điện thoại', en: 'Phone', zh: '电话' }, value: '0931.824.025 / 0937.798.377' },
  { icon: Mail, label: { vi: 'Email', en: 'Email', zh: '邮箱' }, value: 'Ops@lmxalliance.com' },
  { icon: Clock, label: { vi: 'Giờ làm việc', en: 'Hours', zh: '营业时间' }, value: 'T2–T7: 7:00 – 17:00' },
];

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const L = locale as 'vi' | 'en' | 'zh';

  return (
    <>
      <section className="relative overflow-hidden bg-[#015231] text-white py-24 flex items-center" style={{ minHeight: '380px' }}>
        <Image
          src="https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157485/lmx-migration/fyyjevsnrbnxdqbbzton.jpg"
          alt=""
          fill
          priority
          className="object-cover hero-zoom"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(1,82,49,0.92) 0%, rgba(1,82,49,0.72) 60%, rgba(1,82,49,0.5) 100%)' }}
          aria-hidden
        />
        <div className="container-max relative w-full">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              {locale === 'vi' ? 'Chúng tôi luôn sẵn sàng lắng nghe' : locale === 'en' ? 'We are always ready to listen' : '我们随时准备倾听'}
            </p>
            <h1 className="text-white" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)' }}>
              {locale === 'vi' ? 'Liên hệ' : locale === 'en' ? 'Contact' : '联系我们'}
            </h1>
          </AnimateIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <AnimateIn from="left" className="lg:col-span-3">
            <ContactForm locale={locale} />
          </AnimateIn>

          {/* Info */}
          <AnimateIn from="right" delay={0.1} className="lg:col-span-2">
            <div className="bg-[#f8fbf2] p-8 h-full" style={{ borderRadius: '4px' }}>
              <h3 className="font-semibold text-[#015231] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                {locale === 'vi' ? 'Thông tin liên hệ' : locale === 'en' ? 'Contact Information' : '联系方式'}
              </h3>
              <ul className="space-y-5">
                {contactInfo.map(({ icon: Icon, label, value }) => (
                  <li key={value} className="flex gap-3">
                    <div className="w-8 h-8 bg-[#015231] flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-0.5">{label[L]}</p>
                      <p className="text-sm text-[#015231]">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
