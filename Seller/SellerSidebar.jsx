import React from 'react';
import { useLanguage } from '../LanguageContext';

function SellerSidebar({ isOpen, setIsOpen, currentPage, setCurrentPage }) {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'homepage', label: t('homepage'), icon: '🏠' },
    { id: 'product', label: t('product'), icon: '📦' },
    { id: 'calculate', label: t('calculate'), icon: '🧮' },
    { id: 'conclusion', label: t('conclusion'), icon: '📊' },
    { id: 'contact', label: t('contact'), icon: '📞' }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50">
          <h2 className="text-xl font-black text-purple-600">{t('creator_panel')}</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-purple-600 font-bold p-1">
            ✕
          </button>
        </div>
        
        <nav className="p-4 flex flex-col gap-2 h-[calc(100%-85px)]">
          <div>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl font-bold transition-all mb-1 ${
                  currentPage === item.id 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

export default SellerSidebar;