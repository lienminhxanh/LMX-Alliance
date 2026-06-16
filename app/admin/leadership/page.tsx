import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LeadershipActions } from './LeadershipActions';

export default async function LeadershipAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const leaders = await prisma.leader.findMany({ orderBy: { orderIndex: 'asc' } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Leadership</h1>
        <LeadershipActions mode="create" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaders.map((l) => (
          <Card key={l.id} className="relative">
            <div className="aspect-square bg-[#F5F6F8] mb-3 flex items-center justify-center border border-[#E8E9ED]">
              {l.photo ? <img src={l.photo} alt={l.nameVI} className="w-full h-full object-cover" /> : <span className="text-4xl text-[#E8E9ED]">👤</span>}
            </div>
            <p className="font-semibold text-[#1F2937] text-sm">{l.nameVI}</p>
            <p className="text-xs text-[#6B7280] mb-3">{l.positionVI}</p>
            <LeadershipActions mode="edit" leader={l} />
          </Card>
        ))}
        {leaders.length === 0 && (
          <div className="col-span-4 text-center py-12 text-[#6B7280]">No leaders yet</div>
        )}
      </div>
    </div>
  );
}
