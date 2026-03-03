import { PrismaClient } from '@prisma/client'

// ใช้ท่าไม้ตายบังคับค่า (Hardcode) เพื่อให้เปิดหน้าเว็บได้แน่นอน
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db"
    }
  }
} as any) 

export default prisma