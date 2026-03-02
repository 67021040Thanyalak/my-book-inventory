import React from 'react';
import prisma from '../../lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import Link from 'next/link';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const errorType = params.error;

  async function register(formData: FormData) {
    'use server'
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    if (!username || !password) return;
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) redirect('/login?error=exists');
    const user = await prisma.user.create({ data: { username, password: await bcrypt.hash(password, 10) } });
    (await cookies()).set('userId', user.id.toString());
    redirect('/');
  }

  async function login(formData: FormData) {
    'use server'
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) redirect('/login?error=wrong');
    (await cookies()).set('userId', user.id.toString());
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 shadow-2xl w-full max-w-md border-2 border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Bookly</h1>
          <p className="text-slate-500 font-bold mt-2">เข้าสู่ระบบเพื่อเริ่มใช้งาน</p>
        </div>

        <form className="space-y-6">
          {errorType && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-bold border-2 border-red-100 text-center">
              {errorType === 'wrong' ? '❌ ชื่อผู้ใช้หรือรหัสผ่านผิด' : '⚠️ ชื่อนี้ถูกใช้ไปแล้ว'}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">ชื่อผู้ใช้</label>
            <input type="text" name="username" required className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-blue-600 text-slate-900 font-bold" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">รหัสผ่าน</label>
            <input type="password" name="password" required className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-blue-600 text-slate-900 font-bold" />
          </div>
          
          <button formAction={login} className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95">เข้าสู่ระบบ</button>
          
          <div className="flex items-center py-2">
            <div className="flex-1 border-t-2 border-slate-100"></div>
            <span className="px-4 text-xs font-bold text-slate-300">หรือ</span>
            <div className="flex-1 border-t-2 border-slate-100"></div>
          </div>

          <button formAction={register} className="w-full bg-white text-blue-600 border-2 border-blue-600 py-3.5 rounded-lg font-bold hover:bg-blue-50 transition-all">สมัครสมาชิกใหม่</button>
          
          <div className="text-center pt-4">
            <Link href="/reset" className="text-sm font-bold text-slate-400 hover:text-blue-600">ลืมรหัสผ่าน?</Link>
          </div>
        </form>
      </div>
    </main>
  );
}