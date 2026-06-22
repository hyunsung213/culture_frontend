"use client";

import { useState, useEffect } from "react";
import { User, Key, Globe, ChevronRight, ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { useTransition } from "@/context/TransitionContext";

export default function MyPage() {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const { navigateTo } = useTransition();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading || !isAuthenticated) {
    return <div className="flex h-full items-center justify-center">{t.common.loading}</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="flex-1 flex flex-col pt-6 overflow-hidden">
        
        {/* Page Title & Back Button */}
        <div className="px-5 flex items-center mb-8 relative shrink-0">
          <button onClick={() => navigateTo("/")} className="absolute left-3 p-2 text-text-main hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-1.5 w-full justify-center">
            <h1 className="text-[20px] font-bold text-[#222222]">{t.mypage.title}</h1>
            <img src="/assets/logo_mini.png" alt="Logo" className="w-6 h-6 object-contain -mt-0.5" />
          </div>
        </div>

        <div className="px-5 flex flex-col space-y-5 pb-6 flex-1 justify-center">
          
          
          {/* Profile Info */}
          <div className="bg-white rounded-[20px] p-6 shadow-[0_8px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center gap-5">
            <div className="w-[60px] h-[60px] bg-[#f66b1e]/10 rounded-full flex items-center justify-center shadow-inner flex-shrink-0 overflow-hidden relative">
              <img src="/assets/tiger_with_heart.png" alt="User Avatar" className="w-full h-full object-cover translate-y-1" />
            </div>
            <div>
              <p className="text-[#575757] text-[13px] font-semibold mb-1">{t.mypage.userId}</p>
              <p className="text-[#222222] text-[20px] font-black tracking-tight">{user?.loginId}</p>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white rounded-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            
            <div 
              onClick={() => navigateTo("/forgot-password")}
              className="px-6 py-5 border-b border-[#f8f8f8] flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4 text-[#222222] font-bold text-[16px] w-full">
                <div className="w-[40px] h-[40px] rounded-full bg-[#f8f8f8] flex items-center justify-center text-[#575757] flex-shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <span>{t.mypage.changePassword}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
            </div>

            <div className="px-6 py-5 flex flex-col">
              <div className="flex items-center gap-4 text-[#222222] font-bold text-[16px] w-full mb-4">
                <div className="w-[40px] h-[40px] rounded-full bg-[#f8f8f8] flex items-center justify-center text-[#575757] flex-shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <span>{t.mypage.languageSetting}</span>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setLanguage("ko")}
                  className={`flex-1 py-3 rounded-[15px] font-bold text-[14px] transition-all border ${
                    language === "ko" 
                      ? "border-[#f66b1e] bg-[#f66b1e]/10 text-[#f66b1e] shadow-sm" 
                      : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {t.mypage.korean}
                </button>
                <button 
                  onClick={() => setLanguage("en")}
                  className={`flex-1 py-3 rounded-[15px] font-bold text-[14px] transition-all border ${
                    language === "en" 
                      ? "border-[#f66b1e] bg-[#f66b1e]/10 text-[#f66b1e] shadow-sm" 
                      : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {t.mypage.english}
                </button>
              </div>
            </div>

          </div>

          {/* Logout */}
          <div className="pt-2">
            <button 
              onClick={handleLogout}
              className="w-full py-4 text-red-500 font-bold text-[14px] hover:bg-red-50 hover:text-red-600 transition-colors bg-white rounded-[20px] border border-red-100 shadow-[0_8px_20px_rgba(0,0,0,0.02)]"
            >
              {t.mypage.logout}
            </button>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
