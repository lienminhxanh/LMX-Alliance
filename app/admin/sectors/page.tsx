import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { DeleteSectorButton } from './DeleteSectorButton';

export default async function SectorsAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const sectors = await prisma.businessSector.findMany({ orderBy: { orderIndex: 'asc' } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Business Sectors</h1>
        <Link href="/admin/sectors/new">
          <Button size="sm"><Plus size={14} /> New Sector</Button>
        </Link>
      </div>

      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E9ED]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Name (VI)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Updated</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((s) => (
              <tr key={s.id} className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                <td className="px-4 py-3 font-medium text-[#1F2937]">{s.nameVI}</td>
                <td className="px-4 py-3">
                  <Badge variant={s.status === 'PUBLISHED' ? 'success' : s.status === 'DRAFT' ? 'default' : 'warning'}>{s.status}</Badge>
                </td>
                <td className="px-4 py-3 text-[#6B7280]">{formatDate(s.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/sectors/${s.id}`}>
                      <Button variant="ghost" size="sm"><Edit2 size={13} /></Button>
                    </Link>
                    <DeleteSectorButton id={s.id} />
                  </div>
                </td>
              </tr>
            ))}
            {sectors.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-[#6B7280]">No sectors yet</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
