/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // ลบส่วน eslint ออกไปเลยครับ เพราะ Next.js 15+ ไม่ใช้ในนี้แล้ว
};

export default nextConfig;