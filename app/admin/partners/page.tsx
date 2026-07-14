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
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Đối tác</h1>
        <PartnerActions mode="create" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((p) => (
          <Card key={p.id} className="transition-all duration-300 hover:shadow-md hover:border-[#defbbc]">
            <div className="flex items-center gap-3 mb-4">
              {p.logo ? (
                <img src={p.logo} alt={p.nameVI} className="w-12 h-12 object-contain rounded border border-[#E8E9ED] bg-[#FAFAFA] p-1 flex-shrink-0" />
              ) : (
                <div 
                  className="w-12 h-12 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 text-white"
                  style={{ 
                    background: 'linear-gradient(135deg, #015231 0%, #8ec63f 100%)', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  {p.nameVI.split(/\s+/).filter(w => w.length > 0).map(w => w.charAt(0)).slice(0, 2).join('').toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#1F2937] truncate text-sm" title={p.nameVI}>{p.nameVI}</p>
                <p className="text-xs text-[#6B7280] truncate">{p.website || 'Chưa có website'}</p>
              </div>
            </div>
            <PartnerActions mode="edit" partner={p} />
          </Card>
        ))}
        {partners.length === 0 && <div className="col-span-3 text-center py-12 text-[#6B7280]">Chưa có đối tác nào</div>}
      </div>
    </div>
  );
}
