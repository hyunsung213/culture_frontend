"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login as loginApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!loginId || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginApi({ loginId, password });
      login(res.accessToken, res.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col h-full bg-white px-6 justify-between pt-[5%] pb-[5%]">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full flex flex-col h-full max-w-sm mx-auto"
      >
        <div className="flex flex-col items-center flex-shrink-0 mt-[10%] mb-[30%]">
          <h1 className="text-[28px] font-black text-[#f66b1e] tracking-tight">로그인</h1>
          <p className="text-[#575757] text-[15px] mt-2 font-medium">다시 만나서 반가워요!</p>
        </div>

        <div className="w-full flex flex-col justify-center">
          <div className="space-y-[15%]">
            <div className="relative">
              <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">아이디</span>
              <input 
                type="text" 
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="아이디를 입력해주세요"
                className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
              />
            </div>
            <div className="relative">
              <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">비밀번호</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="비밀번호를 입력해주세요"
                className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
              />
            </div>
          </div>
          {error && <p className="w-full text-red-500 text-sm mt-3 font-medium px-1">{error}</p>}
          <div className="w-full flex justify-center mt-[5%] gap-2 px-1">
            <Link href="/forgot-password" className="text-[13px] text-[#575757] font-semibold hover:text-[#f66b1e] transition-colors">
              비밀번호 찾기
            </Link>
            <span className="text-[13px] text-gray-300">|</span>
            <Link href="/signup" className="text-[13px] text-[#575757] font-semibold hover:text-[#f66b1e] transition-colors">
              회원가입
            </Link>
          </div>
        </div>

        <div className="flex-1 min-h-[20px]" />

        <div className="w-full flex flex-col items-center">
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-[56px] bg-[#f66b1e] text-white rounded-[16px] flex items-center justify-center font-bold text-[18px] shadow-[0_8px_20px_rgba(246,107,30,0.25)] hover:bg-[#e05b13] transition-colors disabled:opacity-50"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
