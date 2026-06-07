"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("가장 좋아하는 한국어 단어는?");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!loginId || !password || !quizAnswer) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({ loginId, password, quizQuestion, quizAnswer });
      login(res.accessToken, res.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "회원가입에 실패했습니다.");
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
        <div className="flex flex-col items-center flex-shrink-0 mt-[5%] mb-[15%]">
          <h1 className="text-[28px] font-black text-[#f66b1e] tracking-tight">회원가입</h1>
          <p className="text-[#575757] text-[15px] mt-2 font-medium">간단한 정보만 입력해주세요.</p>
        </div>

        <div className="w-full flex-1 flex flex-col justify-center">
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
                placeholder="비밀번호를 입력해주세요"
                className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">비밀번호 찾기 질문</span>
              <div className="relative">
                <select 
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[15px] font-medium text-[#222222] appearance-none cursor-pointer"
                >
                  <option value="가장 좋아하는 한국어 단어는?">가장 좋아하는 한국어 단어는?</option>
                  <option value="가장 좋아하는 한국 음식은?">가장 좋아하는 한국 음식은?</option>
                  <option value="기억에 남는 여행지는?">기억에 남는 여행지는?</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">답변</span>
              <input 
                type="text" 
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                placeholder="답변을 입력해주세요"
                className="w-full h-[56px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
              />
              <p className="absolute -bottom-[22px] left-[4px] text-[12px] text-gray-400 font-medium">비밀번호를 찾을 때 필요한 답변입니다.</p>
            </div>
          </div>
          {error && <p className="w-full text-red-500 text-sm mt-8 font-medium text-center">{error}</p>}
        </div>

        <div className="flex-1 min-h-[10px]" />

        <div className="w-full flex flex-col items-center pb-[2%] mt-6">
          <button 
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full h-[56px] bg-[#f66b1e] text-white rounded-[16px] flex items-center justify-center font-bold text-[18px] shadow-[0_8px_20px_rgba(246,107,30,0.25)] hover:bg-[#e05b13] transition-colors disabled:opacity-50"
          >
            {isLoading ? "가입 중..." : "가입하기"}
          </button>

          <div className="mt-[6%] flex items-center justify-center w-full">
            <span className="text-[14px] text-gray-500 font-medium">이미 계정이 있으신가요?</span>
            <Link href="/login" className="text-[14px] text-[#f66b1e] font-bold ml-2 hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
