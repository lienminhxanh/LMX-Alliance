import { Fragment } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { NAV_CONFIG } from '@/lib/nav-config';
import { MenuVisibilityToggle } from './MenuVisibilityToggle';

const DISPLAY_LABELS: Record<string, string> = {
  about: 'About',
  'about.intro': 'Company Introduction',
  'about.openLetter': 'Open Letter',
  'about.values': 'Core Values',
  'about.legal': 'Legal Documents',
  'about.leadership': 'Leadership',
  'business-segments': 'Business Segments',
  'shareholder-relations': 'Shareholder Relations',
  'shareholder-relations.governance': 'Governance',
  'shareholder-relations.financial-reports': 'Financial Reports',
  'shareholder-relations.annual-reports': 'Annual Reports',
  news: 'News',
  careers: 'Careers',
  activities: 'Activities',
  'activities.internal': 'Internal Activities',
  'activities.social': 'Social Activities',
};

export default async function MenusAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  if ((session.user as any)?.role !== 'SUPER_ADMIN') redirect('/admin/dashboard');

  const rows = await prisma.menuItemVisibility.findMany();
  const hiddenKeys = new Set(rows.filter((r) => !r.isVisible).map((r) => r.key));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Menu</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Ẩn/hiện mục trên thanh điều hướng trang công khai. Ẩn một trang chỉ gỡ khỏi menu — link truy cập trực tiếp vẫn hoạt động.
        </p>
      </div>
      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E9ED]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Mục</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase">Hiển thị</th>
            </tr>
          </thead>
          <tbody>
            {NAV_CONFIG.filter((item) => item.key !== 'home').map((item) => (
              <Fragment key={item.key}>
                <tr className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                  <td className="px-4 py-3 font-medium text-[#1F2937]">{DISPLAY_LABELS[item.key] ?? item.key}</td>
                  <td className="px-4 py-3 text-right">
                    <MenuVisibilityToggle itemKey={item.key} initialVisible={!hiddenKeys.has(item.key)} />
                  </td>
                </tr>
                {item.dynamicChildren && (
                  <tr className="border-b border-[#F5F6F8]">
                    <td colSpan={2} className="px-4 py-2 pl-8 text-xs text-[#6B7280]">
                      Mục con được quản lý qua Lĩnh vực hoạt động, không phải ở đây.
                    </td>
                  </tr>
                )}
                {item.children?.map((child) => (
                  <tr key={child.key} className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                    <td className="px-4 py-3 pl-8 text-[#374151]">{DISPLAY_LABELS[child.key] ?? child.key}</td>
                    <td className="px-4 py-3 text-right">
                      <MenuVisibilityToggle itemKey={child.key} initialVisible={!hiddenKeys.has(child.key)} />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
