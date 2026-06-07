"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SplashPage() {
  return (
    <div className="flex flex-col h-full bg-[#fefefe] px-6 justify-between pb-8 pt-8">
      {/* Top Spacer */}
      <div className="flex-[0.5]"></div>

      <div className="flex flex-col items-center">
        <motion.img 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          src="/assets/splash_main.svg" 
          alt="이응 로고 아이콘" 
          className="w-2/3 max-w-[150px] object-contain" 
        />
        <motion.img 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          src="/assets/splash_logo.svg" 
          alt="이응" 
          className="w-2/3 max-w-[150px] h-[80px] mt-[12%] object-fill" 
        />
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center mt-[10%] space-y-1 text-center"
        >
          <p className="font-semibold text-[#f66b1e] text-[16px] tracking-[0.16px]">
            하루 하나씩 자연스러운 한국어 표현 학습
          </p>
          <p className="font-semibold text-[#f66b1e] text-[16px] tracking-[0.16px]">
            Learn Korean, not just words
          </p>
        </motion.div>
      </div>

      {/* Bottom Spacer */}
      <div className="flex-[1]"></div>

      <div className="w-full flex flex-col items-center">
        <Link 
          href="/signup" 
          className="w-full max-w-[345px] bg-[#f66b1e] text-white text-[20px] font-extrabold h-[67px] flex items-center justify-center rounded-[10px] shadow-sm hover:bg-orange-600 transition-colors"
        >
          무료로 시작하기
        </Link>
        <Link 
          href="/login" 
          className="font-semibold text-[#575757] text-[16px] mt-6 hover:text-black transition-colors"
        >
          이미 계정이 있으신가요?
        </Link>
      </div>
    </div>
  );
}
