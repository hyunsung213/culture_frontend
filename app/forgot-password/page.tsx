"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPasswordQuiz, verifyPasswordQuiz, resetPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
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
      setError("아이디를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await getPasswordQuiz(loginId);
      setQuizQuestion(res.quizQuestion);
      setStep(2);
    } catch (err: any) {
      setError("잘못된 ID입니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAnswer = async () => {
    setError("");
    if (!quizAnswer) {
      setError("정답을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await verifyPasswordQuiz({ loginId, quizAnswer });
      if (res.verified && res.resetToken) {
        setResetToken(res.resetToken);
        setStep(3);
      } else {
        setError("틀린 대답입니다.");
      }
    } catch (err: any) {
      setError("틀린 대답입니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword || !confirmPassword) {
      setError("새 비밀번호를 모두 입력해주세요.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!resetToken) {
      setError("인증 세션이 만료되었습니다. 처음부터 다시 시도해주세요.");
      setStep(1);
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ resetToken, newPassword });
      setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "비밀번호 재설정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepText = () => {
    if (step === 1) return "가입하신 아이디를 입력해주세요.";
    if (step === 2) return "가입 시 설정한 질문에 답변해주세요.";
    return "새로운 비밀번호를 설정해주세요.";
  };

  return (
    <div className="flex flex-col h-full bg-white px-6 justify-between pt-[5%] pb-[5%]">
      <motion.div
        key={step}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex flex-col h-full max-w-sm mx-auto"
      >
        <div className="flex flex-col items-center flex-shrink-0 mt-[10%] mb-[30%]">
          <h1 className="text-[28px] font-black text-[#f66b1e] tracking-tight">비밀번호 찾기</h1>
          <p className="text-[#575757] text-[15px] mt-2 font-medium text-center">
            {getStepText()}
          </p>
        </div>

        <div className="w-full flex flex-col justify-center">
          <div className="w-full space-y-[15%]">
            {step === 1 && (
              <div className="relative">
                <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">아이디</span>
                <input 
                  type="text" 
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFetchQuiz()}
                  placeholder="아이디를 입력해주세요"
                  className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-[15%] w-full">
                <div className="bg-[#f8f8f8] p-5 rounded-[16px] border border-transparent text-center">
                  <span className="text-[12px] font-bold text-[#f66b1e] block mb-1">질문</span>
                  <p className="text-[#222222] font-bold text-[16px]">{quizQuestion}</p>
                </div>
                
                <div className="relative">
                  <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">답변</span>
                  <input 
                    type="text" 
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyAnswer()}
                    placeholder="답변을 입력해주세요"
                    className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-[15%] w-full">
                <div className="relative">
                  <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">새 비밀번호</span>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호를 입력해주세요"
                    className="w-full h-[50px] px-5 bg-[#f8f8f8] rounded-[16px] border border-transparent focus:border-[#f66b1e] focus:bg-white transition-all outline-none text-[16px] font-medium text-[#222222] placeholder:text-gray-400"
                  />
                </div>
                <div className="relative">
                  <span className="absolute -top-[24px] left-[4px] text-[#575757] text-[14px] font-bold">새 비밀번호 확인</span>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                    placeholder="한 번 더 입력해주세요"
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
              로그인으로 돌아가기
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
            {isLoading ? "처리 중..." : step === 1 || step === 2 ? "다음" : "비밀번호 재설정"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
