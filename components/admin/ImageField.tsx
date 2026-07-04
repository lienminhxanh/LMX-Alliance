'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatFileSize } from '@/lib/utils';

async function uploadFile(file: File, resourceType: 'image' | 'raw' = 'image') {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('resourceType', resourceType);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data as { url: string; name: string; size: number; type: string };
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      onChange(url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#1F2937]">{label}</label>
      {value ? (
        <div className="relative w-40 h-28 border border-gray-200 overflow-hidden" style={{ borderRadius: 4 }}>
          <Image src={value} alt={label} fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-black/60 text-white hover:bg-black/80"
            style={{ borderRadius: 4 }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" loading={uploading} onClick={() => inputRef.current?.click()}>
          <Upload size={14} /> Upload
        </Button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files)} />
    </div>
  );
}

export function ImageGalleryField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const results = await Promise.all(Array.from(files).map((f) => uploadFile(f)));
      onChange([...value, ...results.map((r) => r.url)]);
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#1F2937]">{label}</label>
      <div className="flex flex-wrap gap-3">
        {value.map((url, idx) => (
          <div key={idx} className="relative w-28 h-20 border border-gray-200 overflow-hidden" style={{ borderRadius: 4 }}>
            <Image src={url} alt={`${label} ${idx + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/60 text-white hover:bg-black/80"
              style={{ borderRadius: 4 }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" loading={uploading} onClick={() => inputRef.current?.click()}>
          <Upload size={14} /> Add
        </Button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}

export function FileField({
  label,
  value,
  fileName,
  fileSize,
  onChange,
  accept = 'application/pdf',
}: {
  label: string;
  value: string;
  fileName?: string;
  fileSize?: number;
  onChange: (file: { url: string; name: string; size: number; type: string }) => void;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file, 'raw');
      onChange(result);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#1F2937]">{label}</label>
      {value ? (
        <div className="flex items-center justify-between gap-3 p-3 border border-gray-200" style={{ borderRadius: 4 }}>
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={16} className="text-[#6B7280] flex-shrink-0" />
            <span className="text-sm text-[#1F2937] truncate">{fileName || 'Uploaded file'}</span>
            {!!fileSize && <span className="text-xs text-[#6B7280] flex-shrink-0">{formatFileSize(fileSize)}</span>}
          </div>
          <button
            type="button"
            onClick={() => onChange({ url: '', name: '', size: 0, type: '' })}
            className="w-6 h-6 flex items-center justify-center text-[#6B7280] hover:text-[#1F2937] flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" loading={uploading} onClick={() => inputRef.current?.click()}>
          <Upload size={14} /> Chọn file từ máy
        </Button>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files)} />
    </div>
  );
}
