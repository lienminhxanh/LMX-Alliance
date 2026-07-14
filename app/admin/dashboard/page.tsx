import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Layers, Newspaper, Briefcase, TrendingUp, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const [sectorsCount, newsCount, openJobs, irDocs, pendingContacts, recentContacts, recentNews] = await Promise.all([
    prisma.businessSector.count(),
    prisma.newsArticle.count({ where: { status: 'PUBLISHED' } }),
    prisma.jobPosting.count({ where: { status: 'OPEN' } }),
    prisma.investorDocument.count(),
    prisma.contactMessage.count({ where: { status: 'NEW' } }),
    prisma.contactMessage.findMany({ orderBy: { receivedAt: 'desc' }, take: 5 }),
    prisma.newsArticle.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const kpis = [
    { label: 'Lĩnh vực hoạt động', value: sectorsCount, icon: Layers, href: '/admin/sectors', color: 'bg-blue-50 text-blue-600' },
    { label: 'Tin đã đăng', value: newsCount, icon: Newspaper, href: '/admin/news', color: 'bg-green-50 text-[#059669]' },
    { label: 'Tin tuyển dụng đang mở', value: openJobs, icon: Briefcase, href: '/admin/jobs', color: 'bg-amber-50 text-amber-600' },
    { label: 'Tài liệu cổ đông', value: irDocs, icon: TrendingUp, href: '/admin/shareholder-relations/documents', color: 'bg-purple-50 text-purple-600' },
    { label: 'Liên hệ mới', value: pendingContacts, icon: MessageSquare, href: '/admin/contacts', color: 'bg-red-50 text-[#DC2626]' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Tổng quan</h1>
        <p className="text-sm text-[#6B7280] mt-1">Chào mừng trở lại, {session.user?.name}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {kpis.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}>
            <Card className="hover:border-[#1F2937] transition-colors cursor-pointer">
              <div className={`w-9 h-9 flex items-center justify-center mb-3 ${color}`} style={{ borderRadius: '4px' }}>
                <Icon size={18} />
              </div>
              <div className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-mono)' }}>{value}</div>
              <div className="text-xs text-[#6B7280] mt-1">{label}</div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <Card padding={false}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E9ED]">
            <h3 className="font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Liên hệ gần đây</h3>
            <Link href="/admin/contacts" className="text-xs text-[#6B7280] hover:text-[#1F2937]">Xem tất cả →</Link>
          </div>
          <div className="divide-y divide-[#F5F6F8]">
            {recentContacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">{c.name}</p>
                  <p className="text-xs text-[#6B7280]">{c.subject}</p>
                </div>
                <Badge variant={c.status === 'NEW' ? 'danger' : c.status === 'PROCESSING' ? 'warning' : 'success'}>
                  {{ NEW: 'Mới', PROCESSING: 'Đang xử lý', RESPONDED: 'Đã phản hồi', CLOSED: 'Đã đóng' }[c.status] ?? c.status}
                </Badge>
              </div>
            ))}
            {recentContacts.length === 0 && (
              <p className="px-6 py-4 text-sm text-[#6B7280]">Chưa có liên hệ nào</p>
            )}
          </div>
        </Card>

        {/* Recent News */}
        <Card padding={false}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E9ED]">
            <h3 className="font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Tin tức gần đây</h3>
            <Link href="/admin/news" className="text-xs text-[#6B7280] hover:text-[#1F2937]">Xem tất cả →</Link>
          </div>
          <div className="divide-y divide-[#F5F6F8]">
            {recentNews.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1F2937] truncate">{a.titleVI}</p>
                  <p className="text-xs text-[#6B7280]">{formatDate(a.createdAt)}</p>
                </div>
                <Badge variant={a.status === 'PUBLISHED' ? 'success' : a.status === 'DRAFT' ? 'default' : 'warning'}>
                  {{ PUBLISHED: 'Đã đăng', DRAFT: 'Nháp', SCHEDULED: 'Lên lịch', ARCHIVED: 'Lưu trữ' }[a.status] ?? a.status}
                </Badge>
              </div>
            ))}
            {recentNews.length === 0 && (
              <p className="px-6 py-4 text-sm text-[#6B7280]">Chưa có bài viết nào</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
