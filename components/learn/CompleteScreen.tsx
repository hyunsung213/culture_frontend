import { Expression, Feedback } from "../../types/expression";
import BottomButton from "../layout/BottomButton";
import { motion } from "framer-motion";

interface CompleteScreenProps {
  expression: Expression;
  feedback: Feedback;
  onRestart: () => void;
}

import { useTransition } from "@/context/TransitionContext";
import { useLanguage } from "../../context/LanguageContext";

export default function CompleteScreen({ expression, feedback, onRestart }: CompleteScreenProps) {
  const { navigateTo, runWithTransition } = useTransition();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col flex-1 w-full bg-white overflow-hidden">
      <div className="px-6 flex-1 flex flex-col items-center justify-start text-center overflow-y-auto pt-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full space-y-4 mt-4 pb-8"
        >
          <div>
            <div className="w-[18%] max-w-[64px] aspect-square bg-[#f66b1e]/10 rounded-full flex items-center justify-center mx-auto mb-3 relative">
              <span className="text-[32px] absolute">🎊</span>
            </div>
            <h2 className="text-[18px] font-extrabold text-[#222222] mb-1.5">{t.learn.completeTitle}</h2>
            <p className="text-[#575757] font-medium text-[13px]">{t.learn.completeDesc}</p>
          </div>

          <div className="bg-white rounded-[20px] p-5 w-full text-left space-y-3 shadow-[0_8px_20px_rgba(0,0,0,0.03)] border border-[#f8f8f8]">
            <div>
              <h3 className="text-[11px] font-bold text-[#575757] mb-1.5">{t.learn.learnedExpression}</h3>
              <p className="text-[20px] font-extrabold text-[#f66b1e]">
                {expression.korean} <span className="text-[13px] font-medium text-[#575757] ml-1">{expression.romanization}</span>
              </p>
            </div>
            
            <div className="pt-3 border-t border-[#f8f8f8]">
              <h3 className="text-[11px] font-bold text-[#575757] mb-1.5">{t.learn.learnedExpression}</h3>
              <p className="text-[14px] font-bold text-[#222222] leading-relaxed">
                {feedback.naturalExpression}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center text-[#575757] text-[12px] font-bold bg-[#fff9f5] py-3 rounded-full w-full mt-3">
            {t.learn.savedToDict}
          </div>
        </motion.div>
      </div>

      <div className="bg-white flex flex-col items-center px-6 pb-4 pt-2 relative">
        <div className="absolute -top-[82px] right-6 w-[115px] h-[115px] pointer-events-none z-20">
          <img src="/assets/tiger_hello.png" alt="Tiger Hello Mascot" className="w-full h-full object-contain" />
        </div>
        <BottomButton onClick={() => navigateTo("/dictionary")} className="!mb-4 relative z-10">
          {t.learn.viewDict}
        </BottomButton>
        <button
          onClick={() => runWithTransition(onRestart)}
          className="text-[#575757] text-[14px] font-bold hover:text-[#222222] transition-colors relative z-10"
        >
          {t.learn.learnAgain}
        </button>
      </div>
    </div>
  );
}
