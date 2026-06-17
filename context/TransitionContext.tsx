"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";

interface TransitionContextType {
  navigateTo: (url: string) => void;
  runWithTransition: (action: () => void) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = React.useTransition();
  const [artificialLoading, setArtificialLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const runWithTransition = (action: () => void) => {
    setArtificialLoading(true);
    startTransition(() => {
      action();
    });
    setTimeout(() => {
      setArtificialLoading(false);
    }, 500); // Small delay for synchronous actions to show transition visually
  };

  const navigateTo = (url: string) => {
    if (typeof window !== "undefined" && window.location.pathname === url) {
      return;
    }
    
    // 1. 최소 1.5초 동안 로딩 화면이 유지되도록 강제 상태(artificialLoading)를 켭니다.
    setArtificialLoading(true);
    
    // 2. 1.5초 뒤에 강제 로딩 상태를 해제합니다.
    setTimeout(() => {
      setArtificialLoading(false);
    }, 1500);

    // 3. 페이드 애니메이션 시간(0.3초) 대기 후 라우팅 시작
    // 이렇게 하면 로딩창이 100% 불투명해진 뒤에 뒷배경 페이지가 바뀌므로
    // 갑작스럽게 화면이 바뀌는 현상을 방지하고 부드러운 페이드 아웃/인 효과를 줍니다.
    setTimeout(() => {
      startTransition(() => {
        router.push(url);
      });
    }, 300);
  };

  const showLoading = isPending || artificialLoading;

  return (
    <TransitionContext.Provider value={{ navigateTo, runWithTransition }}>
      {children}
      
      <AnimatePresence>
        {showLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="relative w-[150px] h-[150px] mb-6"
            >
              <Image 
                src="/assets/tiger_hello.png" 
                alt="Loading Mascot" 
                fill 
                className="object-contain" 
                priority
              />
            </motion.div>
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-[#f66b1e] text-[18px] font-extrabold tracking-widest"
            >
              {t.common.loading}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
