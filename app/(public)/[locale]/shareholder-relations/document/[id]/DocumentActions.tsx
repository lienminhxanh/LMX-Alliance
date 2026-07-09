'use client';

import { Download } from 'lucide-react';

export function DocumentDownloadButton({ fileUrl, fileName, downloadLabel }: { fileUrl: string; fileName: string; downloadLabel: string }) {
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName || 'download.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-primary-dark)] hover:bg-[#8ec63f] hover:text-[var(--color-primary-mid)] text-white text-sm font-semibold transition-all rounded shadow-sm"
      style={{ borderRadius: '4px' }}
    >
      <Download size={16} />
      <span>{downloadLabel}</span>
    </button>
  );
}

export function DocumentOpenButton({ fileUrl, openLabel }: { fileUrl: string; openLabel: string }) {
  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleOpen}
      className="text-xs font-semibold text-[#8ec63f] hover:text-[var(--color-primary-dark)] hover:underline transition-all bg-transparent border-none p-0 cursor-pointer"
    >
      {openLabel}
    </button>
  );
}
