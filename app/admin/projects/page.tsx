import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { ProjectActions } from './ProjectActions';

export default async function ProjectsAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Projects</h1>
        <ProjectActions mode="create" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-[#1F2937]">{p.nameVI}</h3>
              <Badge variant={p.status === 'ONGOING' ? 'info' : p.status === 'COMPLETED' ? 'success' : 'default'}>{p.status}</Badge>
            </div>
            <p className="text-xs text-[#6B7280] mb-3">{formatDate(p.createdAt)}</p>
            <ProjectActions mode="edit" project={p} />
          </Card>
        ))}
        {projects.length === 0 && <div className="col-span-3 text-center py-12 text-[#6B7280]">No projects yet</div>}
      </div>
    </div>
  );
}
