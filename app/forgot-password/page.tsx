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
      setError(err.message || "해당 아이디의 질문을 찾을 수 없습니다.");
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
        setError("정답이 일치하지 않습니다.");
      }
    } catch (err: any) {
      setError(err.message || "정답 확인에 실패했습니다.");
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
        <div className="flex flex-col items-center flex-shrink-0 mt-[2%]">
          <h1 className="text-[24px] font-extrabold text-[#f66b1e] tracking-tight">비밀번호 찾기</h1>
          <p className="text-[#575757] font-medium text-[14px] mt-[6%] text-center">
            {getStepText()}
          </p>
        </div>

        <div className="w-full flex-1 flex flex-col justify-center mt-[12%]">
          <div className="w-full space-y-[10%]">
            {step === 1 && (
              <div className="relative">
                <span className="absolute -top-[24px] left-[10px] text-[#575757] text-[14px] font-semibold">이메일</span>
                <input 
                  type="text" 
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFetchQuiz()}
                  className="w-full h-[40px] px-4 bg-[#f66b1e]/10 rounded-[10px] border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-[15px] font-medium text-[#575757]"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-[10%] w-full">
                <div className="bg-[#f66b1e]/10 p-4 rounded-[10px] border border-[#f66b1e]/20 text-center">
                  <span className="text-[12px] font-bold text-[#f66b1e] block mb-1">질문</span>
                  <p className="text-[#575757] font-bold text-[15px]">{quizQuestion}</p>
                </div>
                
                <div className="relative">
                  <span className="absolute -top-[24px] left-[10px] text-[#575757] text-[14px] font-semibold">답변</span>
                  <input 
                    type="text" 
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyAnswer()}
                    className="w-full h-[40px] px-4 bg-[#f66b1e]/10 rounded-[10px] border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-[15px] font-medium text-[#575757]"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-[10%] w-full">
                <div className="relative">
                  <span className="absolute -top-[24px] left-[10px] text-[#575757] text-[14px] font-semibold">새 비밀번호</span>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-[40px] px-4 bg-[#f66b1e]/10 rounded-[10px] border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-[15px] font-medium text-[#575757]"
                  />
                </div>
                <div className="relative">
                  <span className="absolute -top-[24px] left-[10px] text-[#575757] text-[14px] font-semibold">새 비밀번호 확인</span>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                    className="w-full h-[40px] px-4 bg-[#f66b1e]/10 rounded-[10px] border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-[15px] font-medium text-[#575757]"
                  />
                </div>
              </div>
            )}
          </div>
          {error && <p className="w-full text-red-500 text-sm mt-6 font-medium text-center">{error}</p>}
          {successMessage && <p className="w-full text-green-500 text-sm mt-6 font-bold text-center">{successMessage}</p>}
        </div>

        <div className="flex-1 min-h-[10px]" />

        <div className="w-full flex flex-col items-center pb-[2%]">
          <button 
            onClick={step === 1 ? handleFetchQuiz : step === 2 ? handleVerifyAnswer : handleResetPassword}
            disabled={isLoading || !!successMessage}
            className="w-full h-[67px] bg-[#f66b1e] text-white rounded-[10px] flex items-center justify-center font-extrabold text-[20px] shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? "처리 중..." : step === 1 || step === 2 ? "다음" : "비밀번호 재설정"}
          </button>

          <div className="mt-[6%] flex items-center justify-center w-full">
            <Link href="/login" className="text-[14px] text-[rgba(87,87,87,0.58)] font-semibold hover:text-[#f66b1e] transition-colors">
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
