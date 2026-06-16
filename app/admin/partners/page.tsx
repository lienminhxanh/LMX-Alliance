import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { PartnerActions } from './PartnerActions';

export default async function PartnersAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const partners = await prisma.partner.findMany({ orderBy: { orderIndex: 'asc' } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Partners</h1>
        <PartnerActions mode="create" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((p) => (
          <Card key={p.id}>
            <div className="flex items-center gap-3 mb-3">
              {p.logo && <img src={p.logo} alt={p.nameVI} className="w-10 h-10 object-contain" />}
              <div>
                <p className="font-semibold text-[#1F2937]">{p.nameVI}</p>
                <p className="text-xs text-[#6B7280]">{p.website}</p>
              </div>
            </div>
            <PartnerActions mode="edit" partner={p} />
          </Card>
        ))}
        {partners.length === 0 && <div className="col-span-3 text-center py-12 text-[#6B7280]">No partners yet</div>}
      </div>
    </div>
  );
}
