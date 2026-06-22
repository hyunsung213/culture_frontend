import { useLanguage } from "../../context/LanguageContext";
import { Feedback } from "../../types/expression";
import BottomButton from "../layout/BottomButton";
import { motion } from "framer-motion";
interface NaturalExpressionScreenProps {
  feedback: Feedback;
  onNext: () => void;
}

export default function NaturalExpressionScreen({ feedback, onNext }: NaturalExpressionScreenProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col flex-1 w-full bg-white overflow-hidden">
      {/* Header Area */}
      <div className="px-6 pt-6 pb-2 flex-shrink-0">

        <div className="h-1.5 w-full bg-[#f8f8f8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#f66b1e] transition-all duration-300 ease-in-out rounded-full"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div className="px-6 flex-1 flex flex-col justify-start overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 w-full py-10"
        >

          <div className="bg-white border-2 border-[#f66b1e]/20 rounded-[16px] p-4 shadow-[0_8px_20px_rgba(0,0,0,0.03)] relative mt-10">
            <div className="absolute -top-[55px] -right-2 w-[80px] h-[80px] pointer-events-none z-10">
              <img src="/assets/tiger_sitting.png" alt="Tiger Sitting Mascot" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-full border border-[#f66b1e]/20 w-fit mb-2 relative z-20">
              <span className="bg-[#f66b1e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {t.learn.aiSuggestion}
              </span>
              <span className="text-[#f66b1e] font-bold text-[12px]">
                {t.learn.naturalExpression}
              </span>
            </div>
            
            <p className="text-[16px] font-bold text-[#222222] mt-3 mb-4 leading-relaxed">
              {feedback.naturalExpression}
            </p>
            
            <div className="space-y-3 pt-4 border-t border-[#f8f8f8]">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#f66b1e] font-bold flex items-center gap-1">
                  {feedback.tpoBestFit === "공적" && <span className="text-[#f66b1e]">★</span>} 
                  {t.learn.formal}
                </span>
                <p className="text-[13px] text-[#222222] font-semibold bg-[#f66b1e]/10 p-2.5 rounded-[12px] border border-[#f66b1e]/20">{feedback.politeExpression}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#f66b1e] font-bold flex items-center gap-1">
                  {feedback.tpoBestFit === "사적" && <span className="text-[#f66b1e]">★</span>} 
                  {t.learn.semiFormal}
                </span>
                <p className="text-[13px] text-[#222222] font-semibold bg-[#f66b1e]/10 p-2.5 rounded-[12px] border border-[#f66b1e]/20">{feedback.writingExpression}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#f66b1e] font-bold flex items-center gap-1">
                  {feedback.tpoBestFit === "반격식" && <span className="text-[#f66b1e]">★</span>} 
                  {t.learn.casual}
                </span>
                <p className="text-[13px] text-[#222222] font-semibold bg-[#f66b1e]/10 p-2.5 rounded-[12px] border border-[#f66b1e]/20">{feedback.casualExpression}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomButton onClick={onNext}>
        {t.learn.finish}
      </BottomButton>
    </div>
  );
}
