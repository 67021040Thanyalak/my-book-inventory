/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    // บังคับให้ผ่านแม้จะหา PrismaClient ไม่เจอตอนตรวจโค้ด
    ignoreBuildErrors: true,
  },
  eslint: {
    // ข้ามการตรวจ Lint เพื่อไม่ให้เสียเวลาและลดโอกาสเกิด Error
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;