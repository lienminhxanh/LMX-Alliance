import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const ext = file.name.split('.').pop() ?? 'bin';
  const key = `uploads/${uuidv4()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const url = await uploadToR2(buffer, key, file.type);

  await prisma.mediaFile.create({
    data: {
      originalName: file.name,
      storageName: key,
      fileUrl: url,
      fileType: ext,
      mimeType: file.type,
      fileSize: file.size,
      uploadedBy: session.user?.id ?? '',
    },
  });

  return NextResponse.json({ url, key });
}
