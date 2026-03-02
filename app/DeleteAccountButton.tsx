'use client'

import React from 'react'

export default function DeleteAccountButton({ deleteAccountAction }: { deleteAccountAction: () => Promise<void> }) {
  return (
    <form 
      action={deleteAccountAction} 
      onSubmit={(e) => {
        if (!confirm('⚠️ ยืนยันลบบัญชีทิ้ง? ข้อมูลหนังสือทั้งหมดจะหายถาวร!')) {
          e.preventDefault();
        }
      }}
    >
      <button 
        type="submit" 
        className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors font-sans"
      >
        ลบบัญชี
      </button>
    </form>
  )
}