import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { StatisticsManager } from './StatisticsManager';

export default async function StatisticsAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const stats = await prisma.statistic.findMany({ orderBy: { orderIndex: 'asc' } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Số liệu thống kê trang chủ</h1>
      <StatisticsManager initialStats={stats} />
    </div>
  );
}
