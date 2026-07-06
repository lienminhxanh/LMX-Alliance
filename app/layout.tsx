import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  title: 'LMX Alliance - Công ty Cổ phần Liên Minh Xanh',
  description: 'LMX Alliance - Tập đoàn đa ngành hàng đầu Việt Nam',
  icons: {
    icon: '/logo-web.jpg',
    apple: '/logo-web.jpg',
  },
  openGraph: {
    title: 'LMX Alliance - Công ty Cổ phần Liên Minh Xanh',
    description: 'LMX Alliance - Tập đoàn đa ngành hàng đầu Việt Nam',
    siteName: 'LMX Alliance',
    images: [{ url: '/logo-web.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`h-full ${beVietnamPro.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <NextTopLoader color="#5a9e1a" height={3} showSpinner={false} shadow="0 0 8px #a8cc28" />
        {children}
      </body>
    </html>
  );
}
