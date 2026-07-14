import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatFileSize, formatDate } from '@/lib/utils';
import { IRDocumentUpload } from './IRDocumentUpload';
import { DeleteDocumentButton } from './DeleteDocumentButton';

export default async function IRDocumentsPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const docs = await prisma.investorDocument.findMany({ orderBy: [{ year: 'desc' }, { uploadedAt: 'desc' }] });
  const categoryLabels: Record<string, string> = {
    ANNUAL_REPORTS: 'Báo cáo thường niên', FINANCIAL_REPORTS: 'Báo cáo tài chính', DISCLOSURES: 'Công bố thông tin',
    SHAREHOLDER_MEETINGS: 'Đại hội cổ đông', GOVERNANCE: 'Quản trị công ty',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Tài liệu cổ đông</h1>
        <IRDocumentUpload />
      </div>
      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E9ED]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Tên</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Danh mục</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Năm</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Dung lượng</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Ngày tải lên</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id} className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                <td className="px-4 py-3">
                  <a href={d.fileUrl} target="_blank" className="font-medium text-[#1F2937] hover:underline">{d.nameVI}</a>
                </td>
                <td className="px-4 py-3"><Badge>{categoryLabels[d.category] ?? d.category.replace(/_/g, ' ')}</Badge></td>
                <td className="px-4 py-3 text-[#6B7280]">{d.year}</td>
                <td className="px-4 py-3 text-[#6B7280]">{formatFileSize(d.fileSize)}</td>
                <td className="px-4 py-3 text-[#6B7280]">{formatDate(d.uploadedAt)}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteDocumentButton id={d.id} />
                </td>
              </tr>
            ))}
            {docs.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#6B7280]">Chưa có tài liệu nào</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
