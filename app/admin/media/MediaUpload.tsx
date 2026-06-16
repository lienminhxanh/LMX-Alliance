'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MediaUpload() {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      await fetch('/api/upload', { method: 'POST', body: fd });
    }
    router.refresh();
    setUploading(false);
  };

  return (
    <>
      <Button size="sm" loading={uploading} onClick={() => inputRef.current?.click()}>
        <Upload size={14} /> Upload Files
      </Button>
      <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
    </>
  );
}
