import { PrismaClient } from '@prisma/client'

// ใช้ 'as any' เพื่อบังคับให้ TypeScript เลิกบ่นเรื่อง property
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db"
    }
  }
} as any)

export default prisma