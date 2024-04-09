import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  serverRuntimeConfig: {
    secret: process.env.JWT_SECRET,
    SEND_EMAIL: process.env.SEND_EMAIL,
    SEND_EMAIL_HOST: process.env.SEND_EMAIL_HOST,
    SEND_EMAIL_PORT: process.env.SEND_EMAIL_PORT,
    SEND_EMAIL_USERNAME: process.env.SEND_EMAIL_USERNAME,
    SEND_EMAIL_PASSWORD: process.env.SEND_EMAIL_PASSWORD,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    PAYPAL_API_URL: process.env.PAYPAL_API_URL,
},
});
