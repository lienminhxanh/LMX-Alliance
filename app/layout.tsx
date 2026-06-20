import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'LMX Alliance - Công ty Cổ phần Liên Minh Xanh',
  description: 'LMX Alliance - Tập đoàn đa ngành hàng đầu Việt Nam',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`h-full ${roboto.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <NextTopLoader color="#5a9e1a" height={3} showSpinner={false} shadow="0 0 8px #a8cc28" />
        {children}
      </body>
    </html>
  );
}
