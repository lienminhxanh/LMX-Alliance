import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { IRMessagesForm } from './IRMessagesForm';

export default async function IRMessagesPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const messages = await prisma.investorMessage.findMany();
  const ceo = messages.find((m) => m.type === 'CEO_MESSAGE');
  const chair = messages.find((m) => m.type === 'CHAIRMAN_MESSAGE');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-6" style={{ fontFamily: 'var(--font-display)' }}>IR Messages</h1>
      <IRMessagesForm ceoMessage={ceo} chairmanMessage={chair} />
    </div>
  );
}
