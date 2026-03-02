import React from 'react';
import prisma from '../lib/prisma'; 
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DeleteAccountButton from './DeleteAccountButton'; 

export default async function Home() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get('userId');
  if (!userIdCookie) redirect('/login');
  
  const userId = Number(userIdCookie.value);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const books = await prisma.book.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

  async function addBook(formData: FormData) {
    'use server'
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const status = (formData.get('status') as string) || "ยังไม่อ่าน";
    if (!title || !author) return;
    await prisma.book.create({ data: { title, author, status, userId } });
    revalidatePath('/');
  }

  async function deleteBook(formData: FormData) {
    'use server'
    const id = Number(formData.get('id'));
    await prisma.book.delete({ where: { id, userId } });
    revalidatePath('/');
  }

  async function logout() {
    'use server'
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    redirect('/login');
  }

  async function deleteAccount() {
    'use server'
    const cookieStore = await cookies();
    await prisma.user.delete({ where: { id: userId } });
    cookieStore.delete('userId');
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-[#fcfdfe] relative overflow-hidden font-['Sarabun',sans-serif]">
      
      {/* --- อนิเมชันพื้นหลัง (Moving Background Blobs) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-100/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* --- Navbar (Glassmorphism + Slide Down) --- */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/60 animate-[slideDown_0.5s_ease-out]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <span className="text-xl">📚</span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Bookly<span className="text-indigo-600">.</span></span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-sm font-bold text-slate-500">Welcome, <span className="text-slate-900">{user?.username}</span></span>
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              <form action={logout}>
                <button className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Sign Out</button>
              </form>
              <DeleteAccountButton deleteAccountAction={deleteAccount} />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-12 relative z-10">
        
        {/* --- Header (Fade In & Up) --- */}
        <header className="mb-12 animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">
            Manage your <br /> 
            <span className="text-indigo-600">Personal Collection</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">รวบรวมหนังสือเล่มโปรดของคุณไว้ในที่เดียว</p>
        </header>

        {/* --- Form Section (Zoom In) --- */}
        <section className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-xl shadow-indigo-100/20 mb-16 animate-[zoomIn_0.6s_ease-out] relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-t-[2rem]"></div>
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center text-sm text-indigo-600 font-bold">＋</span>
            เพิ่มหนังสือเล่มใหม่
          </h2>
          <form action={addBook} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-4 space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
              <input type="text" name="title" placeholder="ชื่อหนังสือ..." required 
                className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-3.5 outline-none focus:bg-white focus:border-indigo-500 text-slate-900 font-bold transition-all" />
            </div>
            <div className="md:col-span-3 space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Author</label>
              <input type="text" name="author" placeholder="ผู้แต่ง..." required 
                className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-3.5 outline-none focus:bg-white focus:border-indigo-500 text-slate-900 font-bold transition-all" />
            </div>
            <div className="md:col-span-3 space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
              <select name="status" className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-3.5 outline-none focus:bg-white focus:border-indigo-500 text-slate-700 font-bold cursor-pointer transition-all">
                <option value="ยังไม่อ่าน">📖 ยังไม่อ่าน</option>
                <option value="กำลังอ่าน">👀 กำลังอ่าน</option>
                <option value="อ่านจบแล้ว">✅ อ่านจบแล้ว</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-indigo-600 shadow-lg transition-all active:scale-95 duration-300">
                บันทึก
              </button>
            </div>
          </form>
        </section>

        {/* --- Book Grid (Staggered Load) --- */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900">Your Books ({books.length})</h3>
          <div className="h-[1px] flex-1 mx-6 bg-slate-200"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book: any, index: number) => (
            <div key={book.id} 
              className="group bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-3 flex flex-col h-full animate-[fadeInUp_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  book.status === 'อ่านจบแล้ว' ? 'bg-emerald-50 text-emerald-600' :
                  book.status === 'กำลังอ่าน' ? 'bg-amber-50 text-amber-600' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  {book.status}
                </div>
                <form action={deleteBook}>
                  <input type="hidden" name="id" value={book.id} />
                  <button type="submit" className="text-slate-200 hover:text-red-500 transition-colors p-1" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </form>
              </div>

              <h2 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
                {book.title}
              </h2>
              <p className="text-slate-400 font-bold text-sm mb-10">
                Author: <span className="text-slate-600">{book.author}</span>
              </p>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Added {new Date(book.createdAt).toLocaleDateString('th-TH')}</span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 font-black text-[10px]">
                  #{book.id}
                </div>
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="py-32 text-center animate-pulse">
            <div className="text-6xl mb-4 grayscale">🏜️</div>
            <h4 className="text-xl font-black text-slate-300 uppercase tracking-widest">No books yet</h4>
          </div>
        )}
      </div>

      {/* --- อนิเมชัน Keyframes (Inline CSS) --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
    </main>
  );
}