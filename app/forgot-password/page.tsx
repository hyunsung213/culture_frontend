"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPasswordQuiz, verifyPasswordQuiz, resetPassword } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loginId, setLoginId] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFetchQuiz = async () => {
    setError("");
    if (!loginId) {
      setError(t.login.emptyError); // Reusing login's empty error or similar, but wait, there is no ID only error. I'll just use t.forgotPassword.invalidId to be safe or emptyAnswer. Let's use invalidId
      return;
    }

    setIsLoading(true);
    try {
      const res = await getPasswordQuiz(loginId);
      setQuizQuestion(res.quizQuestion);
      setStep(2);
    } catch (err: any) {
      setError(t.forgotPassword.invalidId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAnswer = async () => {
    setError("");
    if (!quizAnswer) {
      setError(t.forgotPassword.emptyAnswer);
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await verifyPasswordQuiz({ loginId, quizAnswer });
      if (res.verified && res.resetToken) {
        setResetToken(res.resetToken);
        setStep(3);
      } else {
        setError(t.forgotPassword.wrongAnswer);
      }
    } catch (err: any) {
      setError(t.forgotPassword.wrongAnswer);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword || !confirmPassword) {
      setError(t.forgotPassword.emptyNewPassword);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError(t.forgotPassword.passwordMismatch);
      return;
    }

    if (!resetToken) {
      setError(t.forgotPassword.sessionExpired);
      setStep(1);
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ resetToken, newPassword });
      setSuccessMessage(t.forgotPassword.success);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || t.forgotPassword.failed);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepText = () => {
    if (step === 1) return t.forgotPassword.step1Desc;
    if (step === 2) return t.forgotPassword.step2Desc;
    return t.forgotPassword.step3Desc;
  };

  return (
    <div className="flex flex-col h-full bg-white px-6 justify-between pt-[5%] pb-[5%] overflow-hidden">
      <motion.div
        key={step}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex flex-col h-full max-w-sm mx-auto"
      >
        <div className="flex flex-col items-center flex-shrink-0 mt-[10%] mb-[30%]">
          <h1 className="text-[28px] font-black text-[#f66b1e] tracking-tight">{t.forgotPassword.title}</h1>
          <p className="text-[#575757] text-[15px] mt-2 font-medium text-center">
            {getStepText()}
          </p>
        </div>

        <div className="w-full flex flex-col justify-center">
          <div className="w-full space-y-[15%]">
            {step === 1 && (
              <div className="relative">
                <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">{t.login.id}</span>
                <input 
                  type="text" 
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFetchQuiz()}
                  placeholder={t.login.idPlaceholder}
                  className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-[15%] w-full">
                <div className="bg-[#f8f8f8] p-5 rounded-[16px] border border-transparent text-center">
                  <span className="text-[12px] font-bold text-[#f66b1e] block mb-1">{t.forgotPassword.quiz}</span>
                  <p className="text-[#222222] font-bold text-[16px]">{quizQuestion}</p>
                </div>
                
                <div className="relative">
                  <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">{t.signup.answerLabel}</span>
                  <input 
                    type="text" 
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyAnswer()}
                    placeholder={t.signup.answerPlaceholder}
                    className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-[15%] w-full">
                <div className="relative">
                  <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">{t.forgotPassword.newPassword}</span>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t.forgotPassword.newPasswordPlaceholder}
                    className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
                  />
                </div>
                <div className="relative">
                  <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">{t.forgotPassword.confirmPassword}</span>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                    placeholder={t.forgotPassword.confirmPlaceholder}
                    className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}
          </div>
          {error && <p className="w-full text-red-500 text-sm mt-3 font-medium px-1 text-center">{error}</p>}
          {successMessage && <p className="w-full text-green-500 text-sm mt-3 font-bold px-1 text-center">{successMessage}</p>}
          
          <div className="w-full flex justify-center mt-[5%] gap-2 px-1">
            <Link href="/login" className="text-[13px] text-[#575757] font-semibold hover:text-[#f66b1e] transition-colors">
              {t.forgotPassword.backToLogin}
            </Link>
          </div>
        </div>

        <div className="flex-1 min-h-[20px]" />

        <div className="w-full flex flex-col items-center">
          <button 
            onClick={step === 1 ? handleFetchQuiz : step === 2 ? handleVerifyAnswer : handleResetPassword}
            disabled={isLoading || !!successMessage}
            className="w-full h-[56px] bg-[#f66b1e] text-white rounded-[16px] flex items-center justify-center font-bold text-[18px] shadow-[0_8px_20px_rgba(246,107,30,0.25)] hover:bg-[#e05b13] transition-colors disabled:opacity-50"
          >
            {isLoading ? t.forgotPassword.processing : step === 1 || step === 2 ? t.forgotPassword.next : t.forgotPassword.resetBtn}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
