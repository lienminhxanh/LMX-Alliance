import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function ApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const { id } = await params;
  const job = await prisma.jobPosting.findUnique({
    where: { id },
    include: { applications: { orderBy: { appliedAt: 'desc' } } },
  });
  if (!job) notFound();
  const statusLabels: Record<string, string> = { NEW: 'Mới', REVIEWING: 'Đang xét', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối' };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/jobs"><Button variant="outline" size="sm"><ArrowLeft size={13} /></Button></Link>
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Danh sách ứng tuyển</h1>
          <p className="text-sm text-[#6B7280]">{job.titleVI}</p>
        </div>
      </div>

      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E9ED]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Ứng viên</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Liên hệ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Ngày ứng tuyển</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase">CV</th>
            </tr>
          </thead>
          <tbody>
            {job.applications.map((app) => (
              <tr key={app.id} className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                <td className="px-4 py-3 font-medium text-[#1F2937]">{app.name}</td>
                <td className="px-4 py-3 text-[#6B7280]">{app.email} · {app.phone}</td>
                <td className="px-4 py-3">
                  <Badge variant={app.status === 'NEW' ? 'info' : app.status === 'APPROVED' ? 'success' : app.status === 'REJECTED' ? 'danger' : 'warning'}>
                    {statusLabels[app.status] ?? app.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-[#6B7280]">{formatDate(app.appliedAt)}</td>
                <td className="px-4 py-3 text-right">
                  <a href={app.cvUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm"><Download size={13} /></Button>
                  </a>
                </td>
              </tr>
            ))}
            {job.applications.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[#6B7280]">Chưa có ứng viên nào</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
