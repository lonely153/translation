import React from 'react';
import { useLanguage } from "../LanguageContext"; // นำเข้า Hook สำหรับเปลี่ยนภาษา
import xLogo from "./pic/vector-twitters-new-x-logo-dark-background-vector_883031-16.avif";
import facebookLogo from "./pic/facebook-ads.webp";
import gmailLogo from "./pic/google-mail-gmail-icon-logo-symbol-free-png.webp";

const ContactPage = () => {
  const { t } = useLanguage(); // เรียกใช้ฟังก์ชัน t สำหรับแปลภาษา

  // กำหนดค่าสี
  const themeColor = "rgb(147, 51, 234)";

  // ปรับข้อมูลลิงก์ให้ดึงค่าจากไฟล์ภาษา
  const contactLinks = [
    { label: t('report_problem'), url: "https://www.google.com/" },
    { label: t('suggestion'), url: "https://www.google.com/" }
  ];

  const socialLinks = [
    { 
      name: "X", 
      url: "https://www.google.com/", 
      img: xLogo 
    },
    { 
      name: "Facebook", 
      url: "https://www.google.com/", 
      img: facebookLogo 
    },
    { 
      name: "Gmail", 
      url: "https://www.google.com/", 
      img: gmailLogo 
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex items-start justify-center p-4 sm:p-8 pt-2 md:pt-6">
      {/* Contact Card */}
      <div className="w-full max-w-[650px] bg-white rounded-[30px] shadow-[0_10px_30px_rgba(238,77,45,0.15)] p-8 md:p-12 text-center transition-all">
        
        {/* Title - ใช้ภาษาจาก Context */}
        <h1 
          className="text-3xl md:text-5xl font-bold pb-4 mb-8 border-b border-gray-100"
          style={{ color: themeColor }}
        >
          {t('contact_title')}
        </h1>

        {/* Links Section */}
        <div className="flex flex-col gap-6 items-start md:items-center mb-10">
          <div className="inline-block text-left space-y-4 w-full">
            {contactLinks.map((link, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                <span 
                  className="font-bold text-lg md:text-xl whitespace-nowrap"
                  style={{ color: themeColor }}
                >
                  {link.label}
                </span>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-base md:text-lg hover:text-[rgb(147,51,234)] transition-colors break-all"
                >
                  {link.url}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Social Icons Container */}
        <div className="flex justify-center items-center gap-4 md:gap-6 mt-6">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-14 h-14 md:w-16 md:h-16 rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300"
            >
              <img 
                src={social.img} 
                alt={social.name} 
                className="w-full h-full object-cover"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;