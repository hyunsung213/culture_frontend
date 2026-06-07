"use client";

import { useState, useEffect } from "react";
import { User, Key, Globe, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useLanguage } from "@/context/LanguageContext";

export default function MyPage() {
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

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
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Absolute Header Overlay */}
      <div className="absolute top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md pb-2 shadow-sm border-b border-gray-100">
        <AppHeader title="마이페이지" />
      </div>

      {/* Scrollable Container */}
      <div className="absolute inset-0 pb-[80px] w-full overflow-y-auto [&::-webkit-scrollbar]:hidden pt-[90px]">
        <div className="p-5 flex flex-col space-y-5 pb-[20px]">
          
          {/* Profile Info */}
          <div className="bg-white rounded-[20px] p-6 shadow-[0_8px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center gap-5">
            <div className="w-[60px] h-[60px] bg-[#f66b1e]/10 rounded-full flex items-center justify-center text-[#f66b1e] shadow-inner flex-shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[#575757] text-[13px] font-semibold mb-1">유저 아이디</p>
              <p className="text-[#222222] text-[20px] font-black tracking-tight">{user?.loginId}</p>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white rounded-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            
            <div className="px-6 py-5 border-b border-[#f8f8f8] flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-4 text-[#222222] font-bold text-[16px] w-full">
                <div className="w-[40px] h-[40px] rounded-full bg-[#f8f8f8] flex items-center justify-center text-[#575757] flex-shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <span>비밀번호 변경</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
            </div>

            <div className="px-6 py-5 flex flex-col">
              <div className="flex items-center gap-4 text-[#222222] font-bold text-[16px] w-full mb-4">
                <div className="w-[40px] h-[40px] rounded-full bg-[#f8f8f8] flex items-center justify-center text-[#575757] flex-shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <span>언어 설정</span>
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
                  한국어
                </button>
                <button 
                  onClick={() => setLanguage("en")}
                  className={`flex-1 py-3 rounded-[15px] font-bold text-[14px] transition-all border ${
                    language === "en" 
                      ? "border-[#f66b1e] bg-[#f66b1e]/10 text-[#f66b1e] shadow-sm" 
                      : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

          </div>

          {/* Logout */}
          <div className="pt-2">
            <button 
              onClick={handleLogout}
              className="w-full py-4 text-gray-400 font-bold text-[14px] hover:text-gray-600 transition-colors bg-white rounded-[20px] border border-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.02)]"
            >
              로그아웃
            </button>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
