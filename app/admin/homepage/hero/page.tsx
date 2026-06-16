import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { HeroForm } from './HeroForm';

export default async function HeroAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const homePage = await prisma.homePage.findFirst();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Homepage Hero</h1>
      <HeroForm initialData={homePage ?? undefined} />
    </div>
  );
}
