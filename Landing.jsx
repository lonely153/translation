import React from 'react';
import { useLanguage } from "./LanguageContext"; // 1. นำเข้า Hook ภาษา

function Landing({ setCurrentPage }) {
  const { t } = useLanguage(); // 2. ดึงฟังก์ชันแปลภาษามาใช้

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in">
      {/* ส่วนหัวข้อ - ปรับให้ดูเป็น Art มากขึ้น */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
          Art List
        </h1>
        <p className="text-gray-500 font-medium">
          {t('landing_subtitle') || "Your creative marketplace community"}
        </p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {/* ปุ่มผู้ซื้อ - เน้นสีชมพูที่เป็นธีมหลักของเรา */}
        <button 
          onClick={() => setCurrentPage('login')}
          className="w-full py-4 bg-pink-500 text-white rounded-2xl shadow-lg shadow-pink-200 hover:bg-pink-600 font-black transition-all active:scale-95 flex items-center justify-center gap-2 group"
        >
          <span>🛍️</span>
          {t('buyer_login') || "Buyer Login"}
          <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
        </button>
        
        {/* ปุ่มผู้ขาย - ใช้สีม่วงเข้มเพื่อให้ดูแตกต่าง */}
        <button 
          onClick={() => setCurrentPage('login')}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 font-black transition-all active:scale-95 flex items-center justify-center gap-2 group"
        >
          <span>🎨</span>
          {t('creator_zone') || "Creator Zone"}
          <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">{t('or') || "OR"}</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        
        {/* ปุ่มเข้าชมทั่วไป */}
        <button 
          onClick={() => setCurrentPage('home')}
          className="w-full py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 font-bold transition-all active:scale-95"
        >
          {t('guest_view') || "Guest View"}
        </button>
      </div>

      {/* เพิ่ม Footer เล็กๆ ให้ดูเป็นหน้า Landing ที่สมบูรณ์ */}
      <p className="mt-20 text-gray-400 text-[10px] font-medium uppercase tracking-[0.2em]">
        © 2024 Art List Studio. All rights reserved.
      </p>
    </div>
  );
}

export default Landing;