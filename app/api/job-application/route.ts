import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobApplicationSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = JobApplicationSchema.parse(body);
    const job = await prisma.jobPosting.findUnique({ where: { id: data.jobId } });
    if (!job || job.status !== 'OPEN') {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    await prisma.jobApplication.create({ data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
