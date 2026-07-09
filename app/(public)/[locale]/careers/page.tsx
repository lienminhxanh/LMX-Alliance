import { getCachedCompanySettings } from '@/lib/cached';
import { prisma } from '@/lib/prisma';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = { vi: 'Tuyển dụng', en: 'Careers', zh: '招聘' };
  const descs: Record<string, string> = {
    vi: 'Cơ hội nghề nghiệp tại LMX Alliance — môi trường chuyên nghiệp, phát triển bền vững và phúc lợi cạnh tranh.',
    en: 'Career opportunities at LMX Alliance — professional environment, sustainable growth and competitive benefits.',
    zh: 'LMX Alliance的职业机会 — 专业环境、可持续发展和有竞争力的福利。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/careers`,
    alternates: { vi: '/vi/careers', en: '/en/careers', zh: '/zh/careers' },
  });
}

const mockJobs = {
  VI: [
    {
      title: '[TP. HCM] Tuyển gấp_Chuyên viên Logistics',
      salary: 'Thỏa thuận theo năng lực',
      dept: 'Bộ phận Logistics & Xuất nhập khẩu',
      expiry: '30/09/2026',
    },
    {
      title: '[TP. HCM] Tuyển gấp_Nhân viên Kỹ Thuật Xây Dựng',
      salary: 'Thỏa thuận theo năng lực',
      dept: 'Bộ phận Xây dựng công trình',
      expiry: '15/10/2026',
    },
    {
      title: '[Đồng Nai] Tuyển gấp_Nhân viên Giám sát Môi trường',
      salary: '10.000.000đ - 15.000.000đ',
      dept: 'Bộ phận Môi trường & Xử lý chất thải',
      expiry: '31/10/2026',
    },
    {
      title: '[TP. HCM] Tuyển gấp_Nhân viên Thu mua Phế liệu',
      salary: '8.000.000đ - 15.000.000đ',
      dept: 'Bộ phận Thu mua',
      expiry: '15/11/2026',
    },
    {
      title: '[Bình Dương] Tuyển gấp_Nhân viên Lái xe Nâng',
      salary: '9.000.000đ - 12.000.000đ',
      dept: 'Bộ phận Kho vận & Logistics',
      expiry: '30/11/2026',
    },
    {
      title: '[TP. HCM] Tuyển gấp_Nhân viên Hành chính Nhân sự',
      salary: 'Thỏa thuận',
      dept: 'Bộ phận Nhân sự',
      expiry: '15/12/2026',
    },
  ],
  EN: [
    {
      title: '[HCMC] Urgent_Logistics Specialist',
      salary: 'Negotiable based on capacity',
      dept: 'Logistics & Import-Export Department',
      expiry: '30/09/2026',
    },
    {
      title: '[HCMC] Urgent_Construction Technical Staff',
      salary: 'Negotiable based on capacity',
      dept: 'Construction Department',
      expiry: '15/10/2026',
    },
    {
      title: '[Dong Nai] Urgent_Environmental Supervision Officer',
      salary: 'VND 10,000,000 - 15,000,000',
      dept: 'Environment & Waste Management Dept',
      expiry: '31/10/2026',
    },
    {
      title: '[HCMC] Urgent_Scrap Procurement Officer',
      salary: 'VND 8,000,000 - 15,000,000',
      dept: 'Procurement Department',
      expiry: '15/11/2026',
    },
    {
      title: '[Binh Duong] Urgent_Forklift Driver',
      salary: 'VND 9,000,000 - 12,000,000',
      dept: 'Warehousing & Logistics Department',
      expiry: '30/11/2026',
    },
    {
      title: '[HCMC] Urgent_HR & Admin Staff',
      salary: 'Negotiable',
      dept: 'Human Resources Department',
      expiry: '15/12/2026',
    },
  ],
  ZH: [
    {
      title: '[胡志明市] 急招_物流专员',
      salary: '薪资面议',
      dept: '物流与进出口部',
      expiry: '30/09/2026',
    },
    {
      title: '[胡志明市] 急招_建筑技术人员',
      salary: '薪资面议',
      dept: '工程建筑部',
      expiry: '15/10/2026',
    },
    {
      title: '[同奈] 急招_环境监察专员',
      salary: '10,000,000 - 15,000,000 越南盾',
      dept: '环境与废物处理部',
      expiry: '31/10/2026',
    },
    {
      title: '[胡志明市] 急招_废料采购专员',
      salary: '8,000,000 - 15,000,000 越南盾',
      dept: '采购部',
      expiry: '15/11/2026',
    },
    {
      title: '[平阳] 急招_叉车司机',
      salary: '9,000,000 - 12,000,000 越南盾',
      dept: '仓储与物流部',
      expiry: '30/11/2026',
    },
    {
      title: '[胡志明市] 急招_人事行政专员',
      salary: '面议',
      dept: '人事部',
      expiry: '15/12/2026',
    },
  ]
};

import { JobPosting } from '@prisma/client';

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  const settings = await getCachedCompanySettings();
  const recruitmentEmail = settings?.recruitmentEmail || settings?.email || 'Ops@lmxalliance.com';
  const phoneOnly = settings?.phone?.split('/')?.[0]?.trim() || '0931.824.025';

  let dbJobs: JobPosting[] = [];
  try {
    dbJobs = await prisma.jobPosting.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch job postings from database:', error);
  }

  const stripHtml = (text: string) => (text || '').replace(/<\/?[^>]+(>|$)/g, "").trim();

  const jobs = dbJobs.length > 0 ? dbJobs.map((j) => {
    const rawTitle = locale === 'vi' ? j.titleVI : locale === 'en' ? j.titleEN : j.titleZH;
    const rawDept = locale === 'vi' ? j.descVI : locale === 'en' ? j.descEN : j.descZH;
    const title = `[${stripHtml(j.location)}] ${stripHtml(rawTitle)}`;
    const dept = stripHtml(rawDept);
    const salary = stripHtml(j.salaryRange);
    const expiry = new Date(j.createdAt.getTime() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN');
    return { title, salary, dept, expiry };
  }) : mockJobs[L];

  return (
    <>
      <section className="relative overflow-hidden py-16 flex items-center" style={{ background: '#0f172a', minHeight: '220px' }}>
        <Image
          src="https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157488/lmx-migration/amlwrqfvdiq8osgpoerq.jpg"
          alt=""
          fill
          priority
          className="object-cover hero-zoom opacity-30"
          aria-hidden
        />
        <div className="container-max relative w-full z-10">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest font-medium mb-2 text-[#8ec63f]">LMX Alliance</p>
            <h1 className="text-white font-extrabold" style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontFamily: 'var(--font-display)' }}>
              {locale === 'vi' ? 'Tuyển dụng' : locale === 'en' ? 'Careers' : '招聘'}
            </h1>
          </AnimateIn>
        </div>
      </section>

      {/* ── Main content (Job Grid) ─────────────── */}
      <section className="section-padding bg-white">
        <div className="container-max">
          {/* Breadcrumb */}
          <div className="mb-8 text-xs text-gray-500">
            <span>{locale === 'vi' ? 'Trang chủ' : locale === 'en' ? 'Home' : '首页'}</span>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-primary-dark)] font-semibold">{locale === 'vi' ? 'Tuyển dụng' : locale === 'en' ? 'Careers' : '招聘'}</span>
          </div>

          {/* Heading intro strip */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-6 mb-10" style={{ borderColor: '#defbbc' }}>
            <div>
              <p className="text-xs uppercase tracking-widest mb-1.5 font-medium text-[#8ec63f]">
                {locale === 'vi' ? 'Cơ hội phát triển' : locale === 'en' ? 'Development Opportunities' : '发展机会'}
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#015231]" style={{ fontFamily: 'var(--font-display)' }}>
                {locale === 'vi' ? 'CƠ HỘI NGHỀ NGHIỆP' : locale === 'en' ? 'CAREER OPPORTUNITIES' : '职业机会'}
              </h2>
            </div>
            <p className="max-w-md text-xs md:text-sm text-gray-600 mt-4 md:mt-0 leading-relaxed">
              {locale === 'vi'
                ? 'Gia nhập Liên Minh Xanh để đồng hành cùng sự phát triển bền vững, kinh tế tuần hoàn và môi trường làm việc chuyên nghiệp.'
                : locale === 'en'
                ? 'Join LMX Alliance to accompany sustainable development, circular economy and professional work environment.'
                : '加入LMX联盟，共同致力于可持续发展、循环经济与专业工作环境。'}
            </p>
          </div>

          {/* Job grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {jobs.map((job, idx) => (
              <AnimateIn key={idx} delay={idx * 0.05} scale>
                <div
                  className="bg-white p-6 border flex flex-col justify-between transition-all hover:shadow-md h-full group"
                  style={{ borderColor: '#e5e7eb', borderRadius: '4px' }}
                >
                  <div>
                    {/* Card logo branding */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold tracking-widest text-[#015231]/80 uppercase">
                        LMX Alliance
                      </span>
                      <span className="text-[9px] font-bold bg-[#8ec63f]/15 text-[#015231] px-2 py-0.5" style={{ borderRadius: '2px' }}>
                        NEW
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-sm md:text-base font-bold text-[#015231] mb-4 line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {job.title}
                    </h3>

                    {/* Job Info details */}
                    <div className="space-y-2 text-xs text-gray-600 mb-6">
                      <div className="flex gap-1.5">
                        <span className="font-semibold text-gray-800 flex-shrink-0">
                          {locale === 'vi' ? 'Mức lương:' : locale === 'en' ? 'Salary:' : '薪资:'}
                        </span>
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="font-semibold text-gray-800 flex-shrink-0">
                          {locale === 'vi' ? 'Đơn vị/ Bộ phận:' : locale === 'en' ? 'Department:' : '部门:'}
                        </span>
                        <span>{job.dept}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="font-semibold text-gray-800 flex-shrink-0">
                          {locale === 'vi' ? 'Ngày hết hạn:' : locale === 'en' ? 'Expiry date:' : '截止日期:'}
                        </span>
                        <span>{job.expiry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Button row */}
                  <div className="flex justify-end pt-3 border-t border-gray-100">
                    <a
                      href={`tel:${phoneOnly}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-[#015231] hover:bg-[#013d27] transition-colors"
                      style={{ borderRadius: '4px' }}
                    >
                      <Phone size={12} />
                      <span>{phoneOnly}</span>
                    </a>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Bottom general app submission */}
          <div className="bg-[#f8fbf2] p-8 md:p-10 text-center" style={{ borderRadius: '4px', border: '1px solid #defbbc' }}>
            <h3 className="text-lg font-bold text-[#015231] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              {locale === 'vi' ? 'Bạn chưa tìm thấy vị trí phù hợp?' : locale === 'en' ? 'Did not find a suitable position?' : '没有找到合适职位？'}
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-xl mx-auto leading-relaxed">
              {locale === 'vi'
                ? 'Đừng ngần ngại gửi CV cho chúng tôi. LMX Alliance luôn chào đón những nhân tài đồng hành cùng sứ mệnh phát triển bền vững.'
                : locale === 'en'
                ? 'Do not hesitate to send us your CV. LMX Alliance always welcomes talents to join our sustainable development mission.'
                : '请随时将您的简历发送给我们。LMX联盟随时欢迎优秀人才加入我们的可持续发展使命。'}
            </p>
            <a
              href={`mailto:${recruitmentEmail}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#015231] hover:bg-[#013d27] text-white text-sm font-semibold transition-colors"
              style={{ borderRadius: '4px' }}
            >
              <Mail size={16} />
              <span>{locale === 'vi' ? 'Gửi CV ứng tuyển tự do' : locale === 'en' ? 'Submit General CV' : '发送自愿求职简历'}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
