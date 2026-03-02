import React from 'react';
import prisma from '../../lib/prisma';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import Link from 'next/link';

export default function ResetPasswordPage() {
  
  async function resetPassword(formData: FormData) {
    'use server'
    const username = formData.get('username') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // เช็คเบื้องต้น
    if (!username || !newPassword || newPassword !== confirmPassword) {
      // ในระบบจริงควรมีแจ้งเตือน (Alert) แต่ตอนนี้เราเน้นให้ทำงานได้ก่อนครับ
      return; 
    }

    // 1. ตรวจสอบว่ามีผู้ใช้นี้จริงไหม
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return;

    // 2. เข้ารหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. อัปเดตลงฐานข้อมูล
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // 4. เสร็จแล้วส่งกลับไปหน้า Login
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white w-full max-w-md relative overflow-hidden">
        {/* แถบสีด้านบนเพิ่มความกุ๊กกิ๊ก */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-pink-400 to-violet-400"></div>
        
        <div className="text-center mb-10 mt-4">
          <div className="text-6xl mb-4 animate-pulse">🔑</div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">ตั้งรหัสผ่านใหม่</h1>
          <p className="text-gray-500 mt-2 font-medium">ระบุชื่อผู้ใช้เพื่อกู้คืนบัญชีของคุณ</p>
        </div>

        <form action={resetPassword} className="flex flex-col gap-5">
          {/* ช่อง Username */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 text-left">ชื่อผู้ใช้ (Username)</label>
            <input 
              type="text" 
              name="username" 
              placeholder="กรอกชื่อผู้ใช้ของคุณ..." 
              required 
              className="w-full bg-gray-50/50 text-gray-900 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all placeholder:text-gray-300"
            />
          </div>

          {/* ช่อง Password ใหม่ */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 text-left">รหัสผ่านใหม่</label>
            <input 
              type="password" 
              name="newPassword" 
              placeholder="รหัสผ่านใหม่..." 
              required 
              className="w-full bg-gray-50/50 text-gray-900 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-400 transition-all placeholder:text-gray-300"
            />
          </div>

          {/* ยืนยัน Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 text-left">ยืนยันรหัสผ่านใหม่</label>
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="ยืนยันรหัสผ่านอีกครั้ง..." 
              required 
              className="w-full bg-gray-50/50 text-gray-900 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-400 transition-all placeholder:text-gray-300"
            />
          </div>

          {/* ปุ่มบันทึก */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-2xl hover:shadow-xl hover:-translate-y-1 font-bold transition-all active:scale-95 mt-2"
          >
            อัปเดตรหัสผ่าน ✨
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center gap-2">
            <span>←</span> กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </main>
  );
}