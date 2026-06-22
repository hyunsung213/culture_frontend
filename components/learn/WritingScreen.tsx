import { useLanguage } from "../../context/LanguageContext";
import { Expression } from "../../types/expression";
import BottomButton from "../layout/BottomButton";
import { motion } from "framer-motion";
import { useState } from "react";
interface WritingScreenProps {
  expression: Expression;
  onNext: () => void;
  onSubmit?: (sentence: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function WritingScreen({ expression, onNext, onSubmit, isLoading, error }: WritingScreenProps) {
  const { t } = useLanguage();
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(text);
    } else {
      onNext();
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-white overflow-hidden relative">
      {/* Header Area */}
      <div className="px-6 pt-6 pb-2 flex-shrink-0">

        <div className="h-1.5 w-full bg-[#f8f8f8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#f66b1e] transition-all duration-300 ease-in-out rounded-full"
            style={{ width: "75%" }}
          />
        </div>
      </div>

      <div className="px-6 flex-1 flex flex-col justify-center overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 my-auto w-full"
        >
          <div className="space-y-3 pt-2">
            <h2 className="text-[20px] font-bold text-[#222222] leading-snug">
              {t.learn.writeYourSentence}<br />
              <span className="text-[13px] text-[#575757] font-medium mt-2 inline-block">
                ㅣ<span className="text-[#f66b1e]">"{expression.korean}"</span>
              </span>
            </h2>
          </div>

          <div className="relative w-full h-[30vh] min-h-[150px] max-h-[220px]">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              placeholder={t.learn.writePlaceholder}
              className="w-full h-full p-5 bg-white border border-[#f66b1e] rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#f66b1e]/20 focus:border-[#f66b1e] resize-none text-[16px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-[#222222]"
            />
            {error && (
              <p className="absolute -bottom-[25px] left-[10px] text-red-500 text-[12px]">{error}</p>
            )}
          </div>

          <div className="bg-[#f66b1e]/10 rounded-[20px] p-5 border border-[#f66b1e]/20 mt-4 text-left">
            <h3 className="font-bold text-[#f66b1e] text-[14px] mb-2">💡 {t.learn.exampleTip}</h3>
            <p className="text-[#222222] text-[14px]">
              {expression.modelSentenceKo}
            </p>
          </div>
        </motion.div>
      </div>

      <BottomButton
        onClick={handleSubmit}
        disabled={text.trim().length === 0 || isLoading}
        variant="outline"
      >
        {t.learn.verifyAI}
      </BottomButton>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <motion.img 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              src="/assets/tiger_with_ball.png" 
              alt="Verifying" 
              className="w-[120px] h-[120px] object-contain drop-shadow-lg" 
            />
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mt-6 text-[18px] font-extrabold text-[#f66b1e] tracking-wide"
            >
              {t.learn.verifyingAI}
            </motion.p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
