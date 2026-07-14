import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Edit2, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function JobsAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const jobs = await prisma.jobPosting.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { applications: true } } },
  });
  const statusLabels: Record<string, string> = { OPEN: 'Đang tuyển', CLOSED: 'Đã đóng', ARCHIVED: 'Lưu trữ' };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Tuyển dụng</h1>
        <Link href="/admin/jobs/new"><Button size="sm"><Plus size={14} /> Tin tuyển dụng mới</Button></Link>
      </div>
      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E9ED]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Tiêu đề</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Địa điểm</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Ứng tuyển</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                <td className="px-4 py-3 font-medium text-[#1F2937]">{j.titleVI}</td>
                <td className="px-4 py-3 text-[#6B7280]">{j.location}</td>
                <td className="px-4 py-3"><Badge variant={j.status === 'OPEN' ? 'success' : 'default'}>{statusLabels[j.status] ?? j.status}</Badge></td>
                <td className="px-4 py-3 text-[#6B7280]">{j._count.applications}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/jobs/${j.id}/applications`}><Button variant="ghost" size="sm"><Users size={13} /></Button></Link>
                    <Link href={`/admin/jobs/${j.id}`}><Button variant="ghost" size="sm"><Edit2 size={13} /></Button></Link>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-[#6B7280]">Chưa có tin tuyển dụng nào</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
