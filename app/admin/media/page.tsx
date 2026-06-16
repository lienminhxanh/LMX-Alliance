import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatFileSize, formatDate } from '@/lib/utils';
import { MediaUpload } from './MediaUpload';

export default async function MediaLibraryPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const files = await prisma.mediaFile.findMany({ orderBy: { uploadedAt: 'desc' } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Media Library</h1>
        <MediaUpload />
      </div>

      {files.length === 0 ? (
        <div className="border-2 border-dashed border-[#E8E9ED] rounded p-16 text-center text-[#6B7280]">
          No files uploaded yet. Use the upload button to add files.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {files.map((f) => (
            <div key={f.id} className="border border-[#E8E9ED] group relative" style={{ borderRadius: '4px' }}>
              <div className="aspect-square bg-[#F5F6F8] flex items-center justify-center overflow-hidden">
                {f.mimeType.startsWith('image/') ? (
                  <img src={f.fileUrl} alt={f.originalName} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <div className="text-xs font-mono text-[#6B7280] uppercase">{f.fileType}</div>
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-[#1F2937] truncate">{f.originalName}</p>
                <p className="text-xs text-[#6B7280]">{formatFileSize(f.fileSize)}</p>
              </div>
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={f.fileUrl} target="_blank" className="block w-6 h-6 bg-white border border-[#E8E9ED] flex items-center justify-center text-xs">↗</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
