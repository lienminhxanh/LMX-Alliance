import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  const resourceType = formData.get('resourceType') === 'raw' ? 'raw' : 'image';

  const ext = file.name.split('.').pop() ?? 'bin';
  const buffer = Buffer.from(await file.arrayBuffer());

  const { url, publicId } = await uploadToCloudinary(buffer, 'lmx-uploads', resourceType);

  await prisma.mediaFile.create({
    data: {
      originalName: file.name,
      storageName: publicId,
      fileUrl: url,
      fileType: ext,
      mimeType: file.type,
      fileSize: file.size,
      uploadedBy: session.user?.id ?? '',
    },
  });

  return NextResponse.json({ url, key: publicId, name: file.name, size: file.size, type: ext });
}
