import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: false, // เปิดใช้งาน PWA
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Config เดิมของพี่ (เช่น output: 'export' ถ้าจะเอาไปขึ้น static host)
  output: 'export', 
  images: { unoptimized: true },
};

export default withPWA(nextConfig);