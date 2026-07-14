import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { ContactActions } from './ContactActions';

export default async function ContactsAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const contacts = await prisma.contactMessage.findMany({ orderBy: { receivedAt: 'desc' } });
  const statusLabels: Record<string, string> = { NEW: 'Mới', PROCESSING: 'Đang xử lý', RESPONDED: 'Đã phản hồi', CLOSED: 'Đã đóng' };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Tin nhắn liên hệ</h1>
      </div>

      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E9ED]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Tên</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Chủ đề</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Ngày nhận</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#1F2937]">{c.name}</p>
                  <p className="text-xs text-[#6B7280]">{c.email}</p>
                </td>
                <td className="px-4 py-3 text-[#6B7280] max-w-xs truncate">{c.subject}</td>
                <td className="px-4 py-3">
                  <Badge variant={c.status === 'NEW' ? 'danger' : c.status === 'PROCESSING' ? 'warning' : c.status === 'RESPONDED' ? 'success' : 'default'}>
                    {statusLabels[c.status] ?? c.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-[#6B7280]">{formatDate(c.receivedAt)}</td>
                <td className="px-4 py-3 text-right">
                  <ContactActions id={c.id} currentStatus={c.status} message={c.message} />
                </td>
              </tr>
            ))}
            {contacts.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-[#6B7280]">Chưa có tin nhắn nào</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
