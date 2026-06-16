import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { UserActions } from './UserActions';

export default async function UsersAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  if ((session.user as any)?.role !== 'SUPER_ADMIN') redirect('/admin/dashboard');

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' }, select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Users</h1>
        <UserActions mode="create" />
      </div>
      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E9ED]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Created</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#1F2937]">{u.name}</p>
                  <p className="text-xs text-[#6B7280]">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === 'SUPER_ADMIN' ? 'danger' : u.role === 'CONTENT_MANAGER' ? 'info' : 'default'}>{u.role.replace('_', ' ')}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.isActive ? 'success' : 'default'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                </td>
                <td className="px-4 py-3 text-[#6B7280]">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <UserActions mode="edit" user={u} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
