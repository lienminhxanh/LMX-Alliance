import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default async function AuditLogsPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  if ((session.user as any)?.role !== 'SUPER_ADMIN') redirect('/admin/dashboard');

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  const actionColors: Record<string, any> = { CREATE: 'success', UPDATE: 'info', DELETE: 'danger' };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Audit Logs</h1>
      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E9ED]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Entity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">IP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#1F2937]">{log.user.name}</p>
                  <p className="text-xs text-[#6B7280]">{log.user.email}</p>
                </td>
                <td className="px-4 py-3"><Badge variant={actionColors[log.action] ?? 'default'}>{log.action}</Badge></td>
                <td className="px-4 py-3 text-[#6B7280]">{log.entity}</td>
                <td className="px-4 py-3 text-[#6B7280] font-mono text-xs">{log.ipAddress}</td>
                <td className="px-4 py-3 text-[#6B7280]">{formatDate(log.createdAt)}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-[#6B7280]">No logs yet</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
