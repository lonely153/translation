import React from 'react';
import { useLanguage } from "./LanguageContext"; // นำเข้า Hook สำหรับเปลี่ยนภาษา

function SignUp({ setCurrentPage, setUser }) {
  const { t } = useLanguage(); // ดึงฟังก์ชัน t มาใช้งาน

  const handleSignUp = (e) => {
    e.preventDefault();
    // จำลองการสมัครและล็อคอินอัตโนมัติ
    setUser({ username: 'NewUser' });
    setCurrentPage('landing'); 
  };

  return (
    <div className="flex justify-center mt-10 animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        <h2 className="text-2xl font-black mb-6 text-gray-800">{t('signup')}</h2>
        
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600 ml-1">{t('table_name')}</label>
            <input 
              type="text" 
              placeholder={t('table_name')} 
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600 ml-1">{t('confirm_password')}</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button type="submit" className="w-full py-3 mt-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-black shadow-md transition-all active:scale-95">
            {t('signup')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600 font-medium">
            {t('already_have_account')}{' '}
            <span 
              onClick={() => setCurrentPage('login')} 
              className="text-blue-600 font-bold cursor-pointer hover:underline underline-offset-4"
            >
              {t('click_here_to_signin')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;