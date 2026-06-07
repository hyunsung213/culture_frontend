import { Feedback } from "../../types/expression";
import BottomButton from "../layout/BottomButton";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";

interface FeedbackScreenProps {
  feedback: Feedback;
  onNext: () => void;
}

export default function FeedbackScreen({ feedback, onNext }: FeedbackScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col flex-1 w-full bg-white overflow-hidden">
      {/* Header Area */}
      <div className="px-6 pt-6 pb-2 flex-shrink-0 z-10 bg-white">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#f66b1e] font-extrabold text-[14px]">
            {t.wordOfTheDay}
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#f8f8f8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#f66b1e] transition-all duration-300 ease-in-out rounded-full"
            style={{ width: "90%" }}
          />
        </div>
      </div>

      <div className="px-6 flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 w-full py-4 pb-10"
        >

          {/* Title */}
          <div className="flex items-center gap-2 pt-2">
            <h2 className="text-[22px] font-bold text-[#222222] flex flex-col gap-2 leading-snug">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={24} className="text-[#22c55e] fill-[#22c55e]/20" />
                <span>{feedback.title || "문장 검증 완료!"}</span>
              </div>
            </h2>
          </div>

          {/* User Sentence */}
          <div className="bg-white border border-[#f8f8f8] rounded-[20px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.03)] mt-2">
            <p className="text-[#222222] font-bold text-[16px] leading-relaxed">
              "{feedback.originalSentence}"
            </p>
          </div>

          {/* Detailed Feedback Cards */}
          <div className="space-y-4">
            <div className="bg-white border border-[#f8f8f8] rounded-[20px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.03)]">
              <h3 className="font-extrabold text-[#f66b1e] text-[14px] mb-2">의미 피드백</h3>
              <p className="text-[#222222] leading-relaxed text-[15px] font-medium">{feedback.meaningFeedback}</p>
              {feedback.meaningCorrect === false && feedback.meaningSuggestion && (
                <div className="mt-4 p-4 bg-[#f66b1e]/10 rounded-[15px] text-[14px] text-[#222222] border border-[#f66b1e]/20">
                  <span className="font-bold text-[#f66b1e] block mb-1">💡 제안</span> 
                  {feedback.meaningSuggestion}
                </div>
              )}
            </div>
            
            <div className="bg-white border border-[#f8f8f8] rounded-[20px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.03)]">
              <h3 className="font-extrabold text-[#f66b1e] text-[14px] mb-2">문법 피드백</h3>
              <p className="text-[#222222] leading-relaxed text-[15px] font-medium">{feedback.grammarFeedback}</p>
              {feedback.grammarCorrect === false && feedback.grammarSuggestion && (
                <div className="mt-4 p-4 bg-[#f66b1e]/10 rounded-[15px] text-[14px] text-[#222222] border border-[#f66b1e]/20">
                  <span className="font-bold text-[#f66b1e] block mb-1">💡 제안</span> 
                  {feedback.grammarSuggestion}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <BottomButton onClick={onNext} variant="outline">
        더 자연스러운 표현 학습하기 &gt;
      </BottomButton>
    </div>
  );
}
