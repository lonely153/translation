import React from 'react';
import { useLanguage } from "./LanguageContext"; 

function Topbar({ setIsSidebarOpen, user, setUser, setCurrentPage }) {
  // เปลี่ยนจาก language เป็น lang ให้ตรงกับไฟล์ Context ของคุณ
  const { lang, toggleLang, t } = useLanguage(); 

  const BuyerIcon = () => (
    <svg className="w-8 h-8 text-pink-500 bg-pink-100 p-1.5 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  );

  const SellerIcon = () => (
    <svg className="w-8 h-8 text-purple-600 bg-purple-100 p-1.5 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
    </svg>
  );

  return (
    <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-white text-black rounded-md hover:bg-gray-100 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <span 
          onClick={() => setCurrentPage('landing')}
          className="ml-4 font-black text-pink-500 text-xl cursor-pointer hover:scale-105 transition-transform"
        >
          Art List
        </span>
      </div>

      <div className="flex items-center gap-4">
        
        {/* --- ปุ่มเปลี่ยนภาษาที่ใช้ค่า lang จาก Context --- */}
        <button 
          onClick={toggleLang}
          className="group relative flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-pink-100 rounded-full transition-all duration-300 hover:border-purple-300 hover:shadow-md active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-purple-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          
          <span className="relative z-10 text-xs">🌐</span>
          
          {/* ใช้ตัวแปร lang (th/en) */}
          <span className="relative z-10 text-xs font-black uppercase tracking-widest text-pink-500 group-hover:text-purple-600">
            {lang === 'th' ? 'TH' : 'EN'}
          </span>

          <div className={`w-2 h-2 rounded-full relative z-10 transition-all duration-500 ${
            lang === 'th' 
              ? 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]' 
              : 'bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.6)]'
          }`}></div>
        </button>

        {user ? (
          <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            {user.role === 'seller' ? <SellerIcon /> : <BuyerIcon />}
            
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-sm leading-tight">
                {user.username}
              </span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                {user.role === 'seller' ? t('creator_mode') : t('buyer_mode')}
              </span>
            </div>
            
            <button 
              onClick={() => {
                setUser(null);
                setCurrentPage('landing');
              }} 
              className="ml-2 text-sm text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition font-medium"
            >
              {t('logout')}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage('login')}
              className="px-4 py-1.5 text-blue-600 font-bold rounded-full hover:bg-blue-50 transition text-sm"
            >
              {t('login')}
            </button>
            <button 
              onClick={() => setCurrentPage('signup')}
              className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-md text-sm"
            >
              {t('signup')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;