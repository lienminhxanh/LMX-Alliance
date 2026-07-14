import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { DeleteNewsButton } from './DeleteNewsButton';

export default async function NewsAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const articles = await prisma.newsArticle.findMany({ orderBy: { createdAt: 'desc' } });

  const catColors: Record<string, any> = {
    COMPANY_NEWS: 'info', INVESTOR_RELATIONS: 'success', SUSTAINABILITY: 'default', RECRUITMENT: 'warning'
  };
  const catLabels: Record<string, string> = {
    COMPANY_NEWS: 'Tin công ty', INVESTOR_RELATIONS: 'Quan hệ cổ đông', SUSTAINABILITY: 'Phát triển bền vững', RECRUITMENT: 'Tuyển dụng'
  };
  const statusLabels: Record<string, string> = {
    DRAFT: 'Nháp', PUBLISHED: 'Đã đăng', SCHEDULED: 'Lên lịch', ARCHIVED: 'Lưu trữ'
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Tin tức</h1>
        <Link href="/admin/news/new"><Button size="sm"><Plus size={14} /> Bài viết mới</Button></Link>
      </div>
      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E9ED]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Tiêu đề</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Danh mục</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Ngày tạo</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                <td className="px-4 py-3 font-medium text-[#1F2937] max-w-xs truncate">{a.titleVI}</td>
                <td className="px-4 py-3"><Badge variant={catColors[a.category]}>{catLabels[a.category] ?? a.category}</Badge></td>
                <td className="px-4 py-3"><Badge variant={a.status === 'PUBLISHED' ? 'success' : 'default'}>{statusLabels[a.status] ?? a.status}</Badge></td>
                <td className="px-4 py-3 text-[#6B7280]">{formatDate(a.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/news/${a.id}`}><Button variant="ghost" size="sm"><Edit2 size={13} /></Button></Link>
                    <DeleteNewsButton id={a.id} />
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-[#6B7280]">Chưa có bài viết nào</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
