import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LMX Alliance - Công ty Cổ phần Liên Minh Xanh',
  description: 'LMX Alliance - Tập đoàn đa ngành hàng đầu Việt Nam',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
