/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // ลบส่วน eslint ออกไปเลยครับ เพราะ Next.js เวอร์ชันนี้ไม่รองรับในนี้แล้ว
};

export default nextConfig;