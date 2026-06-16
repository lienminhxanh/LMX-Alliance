import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { JobForm } from '../JobForm';

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.jobPosting.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <JobForm
      initialData={{
        id: job.id,
        titleVI: job.titleVI, titleEN: job.titleEN, titleZH: job.titleZH,
        descVI: job.descVI, descEN: job.descEN, descZH: job.descZH,
        requirements: job.requirements, benefits: job.benefits,
        location: job.location, salaryRange: job.salaryRange, status: job.status,
      }}
    />
  );
}
