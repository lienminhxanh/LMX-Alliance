'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, FileText } from 'lucide-react';
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
  const inputId = useRef(`file-input-${Math.random().toString(36).substr(2, 9)}`);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      onChange(url);
    } catch (err) {
      console.error(err);
      alert('Tải lên thất bại: ' + (err instanceof Error ? err.message : String(err)));
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
        <div>
          <label
            htmlFor={inputId.current}
            className="inline-flex items-center justify-center font-medium transition-colors border border-[#1F2937] text-[#1F2937] hover:bg-[#1F2937] hover:text-white px-3 py-1.5 text-sm gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderRadius: 0 }}
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload size={14} /> Tải lên
              </>
            )}
          </label>
          <input
            id={inputId.current}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files)}
            disabled={uploading}
          />
        </div>
      )}
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
  const inputId = useRef(`gallery-input-${Math.random().toString(36).substr(2, 9)}`);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const results = await Promise.all(Array.from(files).map((f) => uploadFile(f)));
      onChange([...value, ...results.map((r) => r.url)]);
    } catch (err) {
      console.error(err);
      alert('Tải lên thất bại: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#1F2937]">{label}</label>
      <div className="flex flex-wrap gap-3 items-end">
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
        <div>
          <label
            htmlFor={inputId.current}
            className="inline-flex items-center justify-center font-medium transition-colors border border-[#1F2937] text-[#1F2937] hover:bg-[#1F2937] hover:text-white px-3 py-1.5 text-sm gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderRadius: 0 }}
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload size={14} /> Thêm ảnh
              </>
            )}
          </label>
          <input
            id={inputId.current}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
          />
        </div>
      </div>
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
  const inputId = useRef(`file-doc-input-${Math.random().toString(36).substr(2, 9)}`);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const resourceType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') ? 'image' : 'raw';
      const result = await uploadFile(file, resourceType);
      onChange(result);
    } catch (err) {
      console.error(err);
      alert('Tải lên thất bại: ' + (err instanceof Error ? err.message : String(err)));
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
            <span className="text-sm text-[#1F2937] truncate">{fileName || 'Tệp đã tải lên'}</span>
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
        <div>
          <label
            htmlFor={inputId.current}
            className="inline-flex items-center justify-center font-medium transition-colors border border-[#1F2937] text-[#1F2937] hover:bg-[#1F2937] hover:text-white px-3 py-1.5 text-sm gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderRadius: 0 }}
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload size={14} /> Chọn file từ máy
              </>
            )}
          </label>
          <input
            id={inputId.current}
            type="file"
            accept={accept}
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files)}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}
