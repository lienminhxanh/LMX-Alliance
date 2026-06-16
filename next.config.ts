import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'files.lmxalliance.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
