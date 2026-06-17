import { useLanguage } from "../../context/LanguageContext";
import { Expression } from "../../types/expression";
import BottomButton from "../layout/BottomButton";
import { motion } from "framer-motion";
interface WordIntroScreenProps {
  expression: Expression;
  mode: "meaning" | "example";
  onNext: () => void;
}

export default function WordIntroScreen({ expression, mode, onNext }: WordIntroScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col flex-1 w-full bg-white overflow-hidden">
      {/* Header Area */}
      <div className="px-6 pt-6 pb-2 flex-shrink-0">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#f66b1e] font-extrabold text-[14px]">
            {mode === "meaning" ? t.learn.wordOfTheDay : t.learn.exampleSentence}
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#f8f8f8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#f66b1e] transition-all duration-300 ease-in-out rounded-full"
            style={{ width: mode === "meaning" ? "25%" : "50%" }}
          />
        </div>
      </div>

      <div className="px-6 flex-1 flex flex-col justify-center overflow-y-auto">
        <motion.div
          key={mode} // Re-animate on mode change
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 my-auto"
        >

          <div className="flex-shrink-0">
            <h1 className="text-[32px] font-black text-[#222222] flex items-end gap-3 leading-none">
              {expression.korean}
              <span className="text-[16px] text-[#575757] font-normal pb-1">{expression.romanization}</span>
            </h1>
          </div>

          {mode === "meaning" ? (
            /* Meaning Card */
            <div className="bg-white border border-[#f8f8f8] shadow-[0_8px_20px_rgba(0,0,0,0.03)] rounded-[20px] p-6 space-y-4">
              <h3 className="font-extrabold text-[#f66b1e] text-[13px] uppercase tracking-widest">{t.learn.meaning}</h3>
              <p className="text-[#222222] font-bold text-[16px] leading-relaxed">
                "{expression.shortMeaningKo}"
              </p>
              <p className="text-[#575757] text-[14px] leading-relaxed">
                {expression.shortMeaningEn}
              </p>
            </div>
          ) : (
            /* Example Sentence & Tip Card */
            <div className="space-y-5">
              <div className="bg-white border border-[#f8f8f8] rounded-[20px] p-6 space-y-4 shadow-[0_8px_20px_rgba(0,0,0,0.03)] relative">
                <p className="text-[#f66b1e] text-[20px] font-black italic leading-none">"</p>
                <p className="text-[#222222] font-bold text-[16px] leading-relaxed mt-1 z-10 relative">
                  {expression.modelSentenceKo}
                </p>
                <p className="text-[#575757] text-[13px] border-t border-[#f8f8f8] pt-4 z-10 relative pr-4">
                  {expression.modelSentenceEn}
                </p>
                <p className="absolute bottom-6 right-6 text-[#f66b1e] text-[20px] font-black italic leading-none rotate-180">"</p>
              </div>

              <div className="bg-[#f66b1e]/10 rounded-[20px] p-6 border border-[#f66b1e]/20">
                <h3 className="font-bold text-[#f66b1e] text-[14px] mb-3">💡 {t.learn.tip}</h3>
                <p className="text-[#222222] text-[14px] leading-relaxed">
                  {expression.usageTip}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <BottomButton onClick={onNext} variant="outline">
        {mode === "meaning" ? t.learn.seeExample : t.learn.createSentence}
      </BottomButton>
    </div>
  );
}
