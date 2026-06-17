import Image from "next/image";
import { SavedExpression } from "../../types/expression";

interface SavedExpressionCardProps {
  expression: SavedExpression;
}
import { useLanguage } from "../../context/LanguageContext";

export default function SavedExpressionCard({ expression }: SavedExpressionCardProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-[10px] p-4 border border-black/5 shadow-[0_1px_4px_rgba(12,12,13,0.05),_0_1px_4px_rgba(12,12,13,0.1)] mb-3 relative overflow-hidden">
      <div className="mb-4 relative z-10">
        <h2 className="text-[20px] font-extrabold text-[#f66b1e] flex items-baseline gap-2">
          {expression.word}
          <span className="text-[13px] font-normal text-[#575757]">{expression.romanization}</span>
        </h2>
        <span className="text-[12px] text-[#575757] mt-1 block">{expression.createdAt}</span>
      </div>

      <div className="space-y-3 relative z-10">
        <div>
          <h3 className="text-[13px] font-semibold text-[#575757] mb-1">{t.dictionary.mySentence}</h3>
          <p className="text-black font-semibold text-[14px] leading-[1.4]">
            “{expression.originalSentence}”
          </p>
        </div>
        
        <div>
          <h3 className="text-[13px] font-semibold text-[#f66b1e] mb-1">{t.dictionary.aiFeedback}</h3>
          <p className="text-black font-semibold text-[14px] leading-[1.4]">
            “{expression.correctedSentence}”
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 relative z-10">
        {expression.tags.map((tag, index) => (
          <span key={index} className="text-[11px] font-semibold text-[#575757] bg-[#f8f8f8] border border-[#E2E4E9] px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Footprint Seal */}
      <div className="absolute right-[5%] bottom-[5%] w-[86px] h-[80px] -rotate-[15deg] pointer-events-none opacity-15 z-0">
        <Image src="/assets/footprint.png" alt="Footprint Seal" fill className="object-contain" />
      </div>
    </div>
  );
}
