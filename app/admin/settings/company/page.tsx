import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CompanySettingsForm } from './CompanySettingsForm';

export default async function CompanySettingsPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const settings = await prisma.companySettings.findFirst();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Company Settings</h1>
      <CompanySettingsForm initialData={settings ?? undefined} />
    </div>
  );
}
