import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

const ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!ALLOWED_MIME.includes(file.type))
      return NextResponse.json({ error: 'Only PDF, DOC, DOCX files are allowed' }, { status: 400 });
    if (file.size > MAX_BYTES)
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await uploadToCloudinary(buffer, 'lmx-cv-uploads', 'raw');

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
