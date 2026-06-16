import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { Sidebar } from '@/components/admin/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <div className="flex min-h-screen bg-[#F5F6F8]">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-auto">
            {children}
          </main>
        </div>
      </ToastProvider>
    </SessionProvider>
  );
}
