import React, { useState } from 'react';
import { db } from './firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useLanguage } from "./LanguageContext"; // 1. นำเข้า Hook ภาษา

function Login({ setCurrentPage, setUser }) {
  const { t } = useLanguage(); // 2. ดึงฟังก์ชันแปลภาษามาใช้
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // 1. ค้นหาใน Collection "buyers"
      let q = query(collection(db, "buyers"), where("email", "==", email));
      let querySnapshot = await getDocs(q);

      // 2. ถ้าไม่เจอใน "buyers" ให้หาใน "sellers"
      if (querySnapshot.empty) {
        q = query(collection(db, "sellers"), where("email", "==", email));
        querySnapshot = await getDocs(q);
      }

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        setUser({ 
          id: userDoc.id, 
          username: userData.username,
          role: userData.role, 
          cart: userData.cart || []
        });
        
        setCurrentPage('home'); 
      } else {
        // ใช้คำแปลสำหรับข้อความ Alert
        alert(t('email_not_found')); 
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      alert(t('db_error'));
    }
  };

  return (
    <div className="flex justify-center mt-10 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        {/* ใช้ t('login') หรือสร้าง Key ใหม่เช่น t('please_signin') */}
        <h2 className="text-2xl font-black mb-6 text-gray-800">{t('login')}</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600 ml-1">Email</label>
            <input 
              type="email"
              placeholder="email@example.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600 ml-1">Password</label>
            <input 
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="remember" className="text-sm font-medium">{t('remember_me')}</label>
          </div>

          <button type="submit" className="w-full py-3 mt-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-black shadow-md transition-all active:scale-95">
            {t('login')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600 font-medium">
            {t('no_account_yet')}{' '}
            <span 
              onClick={() => setCurrentPage('signup')} 
              className="text-blue-600 cursor-pointer hover:underline font-bold"
            >
              {t('signup')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;