"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("가장 좋아하는 한국어 단어는?");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!loginId || !password || !quizAnswer) {
      setError(t.signup.emptyError);
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({ loginId, password, quizQuestion, quizAnswer });
      login(res.accessToken, res.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || t.signup.signupFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white px-6 justify-between pt-[5%] pb-[5%] overflow-hidden">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full flex flex-col h-full max-w-sm mx-auto"
      >
        <div className="flex flex-col items-center flex-shrink-0 mt-[5%] mb-[15%]">
          <h1 className="text-[28px] font-black text-[#f66b1e] tracking-tight">{t.signup.title}</h1>
          <p className="text-[#575757] text-[15px] mt-2 font-medium">{t.signup.subtitle}</p>
        </div>

        <div className="w-full flex-1 flex flex-col justify-center">
          <div className="space-y-[15%]">
            <div className="relative">
              <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">{t.login.id}</span>
              <input 
                type="text" 
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder={t.login.idPlaceholder}
                className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
              />
            </div>
            <div className="relative">
              <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">{t.login.password}</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.login.passwordPlaceholder}
                className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">{t.signup.quizLabel}</span>
              <div className="relative">
                <select 
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[15px] font-medium text-[#222222] appearance-none cursor-pointer"
                >
                  <option value="가장 좋아하는 한국어 단어는?">{t.signup.quiz1}</option>
                  <option value="가장 좋아하는 한국 음식은?">{t.signup.quiz2}</option>
                  <option value="기억에 남는 여행지는?">{t.signup.quiz3}</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">{t.signup.answerLabel}</span>
              <input 
                type="text" 
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                placeholder={t.signup.answerPlaceholder}
                className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
              />
              <p className="absolute -bottom-[22px] left-[4px] text-[12px] text-gray-400 font-medium">{t.signup.answerDesc}</p>
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
            {isLoading ? t.signup.signingUp : t.signup.signupBtn}
          </button>

          <div className="mt-[6%] flex items-center justify-center w-full">
            <span className="text-[14px] text-gray-500 font-medium">{t.signup.alreadyHaveAccount}</span>
            <Link href="/login" className="text-[14px] text-[#f66b1e] font-bold ml-2 hover:underline">
              {t.signup.loginLink}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
