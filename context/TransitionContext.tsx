"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TransitionContextType {
  navigateTo: (url: string) => void;
  runWithTransition: (action: () => void) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = React.useTransition();
  const [artificialLoading, setArtificialLoading] = useState(false);
  const router = useRouter();

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
    
    // Ensure loading screen shows for at least 1 second
    setArtificialLoading(true);
    startTransition(() => {
      router.push(url);
    });
    setTimeout(() => {
      setArtificialLoading(false);
    }, 1000);
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
              로딩중....
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
