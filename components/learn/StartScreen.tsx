import { useLanguage } from "../../context/LanguageContext";
import { Expression } from "../../types/expression";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Lock, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import BottomNav from "../layout/BottomNav";

import { ApiWordSummary, ApiWordTodayProgress } from "../../types/api";
import { fetchWordsSummary } from "../../lib/api";

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

interface StartScreenProps {
  expression: Expression | null;
  progress?: ApiWordTodayProgress;
  onNext: () => void;
  onReview?: (wordId: string) => void;
}

export default function StartScreen({ expression, progress, onNext, onReview }: StartScreenProps) {
  const { t } = useLanguage();
  const [activeTooltip, setActiveTooltip] = useState<number | null>(progress?.currentOrder || 1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [allWords, setAllWords] = useState<ApiWordSummary[]>([]);

  useEffect(() => {
    fetchWordsSummary().then(setAllWords).catch(console.error);
  }, []);

  useEffect(() => {
    if (progress?.currentOrder) {
      setActiveTooltip(progress.currentOrder);
    }
  }, [progress?.currentOrder]);

  const patternLefts = [30, 50, 70, 80, 70, 50, 30, 20];
  const total = progress?.totalWords || 30;
  const current = progress?.currentOrder || 1;
  const isAllDone = progress?.allCompleted || false;

  const steps = Array.from({ length: total }).map((_, i) => {
    const order = i + 1;
    let status = "locked";
    if (isAllDone || order < current) status = "completed";
    else if (order === current) status = "active";
    
    const wordInfo = allWords.length > i ? allWords[i] : null;

    return {
      id: order,
      status,
      left: patternLefts[i % patternLefts.length],
      wordKorean: wordInfo ? wordInfo.korean : "",
      wordId: wordInfo ? wordInfo.id : "",
    };
  });

  useEffect(() => {
    setTimeout(() => {
      const activeStepEl = document.getElementById("step-active");
      if (activeStepEl) {
        activeStepEl.scrollIntoView({ behavior: "auto", block: "center" });
      }
    }, 100);
  }, [allWords, progress]);

  const getStoneColor = (status: string) => {
    if (status === "locked") return "#E2E4E9"; // Ellipse 22
    if (status === "active") return "#FFE0C2"; // Highlight for active
    if (status === "completed") return "#FFF3EB"; // Passed step
    return "#E2E4E9";
  };

  const getStoneShadow = (status: string) => {
    if (status === "locked") return "shadow-[0_6px_0_0_#C9CDD5,0_10px_10px_rgba(0,0,0,0.05)]"; 
    if (status === "active") return "shadow-[0_6px_0_0_#FFB87A,0_10px_10px_rgba(0,0,0,0.08)]"; 
    if (status === "completed") return "shadow-[0_6px_0_0_#FFE0C2,0_10px_10px_rgba(0,0,0,0.05)]"; 
    return "shadow-[0_6px_0_0_#C9CDD5,0_10px_10px_rgba(0,0,0,0.05)]";
  };

  const FootprintIcon = () => (
    <div className="w-8 h-8 relative opacity-90">
      <Image src="/assets/footprint.png" alt="완료" fill sizes="32px" className="object-contain" />
    </div>
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    if (scrollHeight > 0) {
      const progress = (target.scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-white">


      {/* Fixed Header & Word of the Day Card (Absolute Overlay) */}
      <div className="absolute top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-md pt-[4%] pb-[4%] px-6">
        <h1 className="text-[22px] font-black text-[#222222]">{t.start.greeting}</h1>
        <p className="text-[#575757] text-[13px] font-medium mt-1">{t.start.greetingDesc}</p>

        {/* Word of the Day Card */}
        <div className="bg-white/60 backdrop-blur-lg rounded-[20px] p-[5%] shadow-[0_8px_20px_rgba(0,0,0,0.03)] relative mt-[5%]">
          <div className="flex justify-between items-start mb-[2%]">
            <span className="text-[#f66b1e] font-bold text-[12px]">{t.learn.wordOfTheDay}</span>
          </div>
          <h2 className="text-[24px] font-black text-[#222222] flex items-end gap-2 mb-[2%]">
            {expression ? expression.korean : "..."}
            <span className="text-[14px] font-medium text-[#575757] pb-0.5">
              {expression ? expression.romanization : ""}
            </span>
          </h2>
          <p className="text-[#222222] text-[12px] font-medium leading-relaxed">
            {expression ? expression.shortMeaningKo : t.start.loadingExpression}
          </p>
        </div>
      </div>

      {/* Custom Progress Bar on the Right */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 h-[150px] w-[4px] bg-[#f8f8f8] rounded-full z-40 overflow-hidden shadow-inner flex flex-col justify-start">
        <div 
          className="w-full bg-[#f66b1e] rounded-full transition-all duration-150 ease-out" 
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Scrollable Container (Only Steps) */}
      <div 
        className="absolute inset-0 pb-20 w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pt-[220px]"
        onScroll={handleScroll}
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, transparent 210px, black 250px, black calc(100% - 100px), transparent calc(100% - 60px))',
          maskImage: 'linear-gradient(to bottom, transparent 0px, transparent 210px, black 250px, black calc(100% - 100px), transparent calc(100% - 60px))'
        }}
      >

        {/* Roadmap Section */}
        <div className="w-full flex flex-col gap-[35px] pt-[40px] pb-[80px]">
          {steps.map((step, index) => {
            const nextStep = steps[index + 1];
            return (
            <div
              key={step.id}
              id={step.status === "active" ? "step-active" : undefined}
              className="w-full relative snap-center flex items-center justify-center cursor-pointer"
              style={{ height: '80px' }}
              onClick={() => setActiveTooltip(step.id)}
            >
              <div 
                className={`absolute w-[118px] h-[58px] flex items-center justify-center`}
                style={{ left: `${step.left}%`, transform: 'translateX(-50%)' }}
              >
                {/* 3D Stone Background */}
                <div 
                  className={`absolute inset-0 z-0 rounded-[50%] ${getStoneShadow(step.status)} transition-all duration-300`}
                  style={{ backgroundColor: getStoneColor(step.status) }}
                />
                
                {/* Stone Content */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  {step.status === "locked" && <Lock size={20} className="text-gray-400" />}
                  {step.status === "completed" && <FootprintIcon />}
                </div>

                {/* Character Image */}
                {step.status === "active" && (
                  <div 
                    className={`absolute -bottom-[10px] left-1/2 transform -translate-x-1/2 w-[160px] h-[160px] z-20 pointer-events-none ${step.left >= 60 ? '-scale-x-100' : ''}`}
                  >
                    <Image src="/assets/tiger.png" alt="Tiger Mascot" fill sizes="160px" priority className="object-contain drop-shadow-xl origin-bottom" />
                  </div>
                )}
              </div>

              {/* Tooltip Bubble (Full Width Bottom) */}
              <AnimatePresence>
                {activeTooltip === step.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-[70px] left-0 w-full z-30 flex justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (step.status === "active") onNext();
                      if (step.status === "completed" && step.wordId && onReview) onReview(step.wordId);
                    }}
                  >
                    {/* Tooltip Triangle (pointing up towards the stone, aligned to the full width) */}
                    <div 
                      className="absolute -top-2 w-0 h-0 border-x-[10px] border-x-transparent border-b-[12px] border-b-white z-10" 
                      style={{ left: `${step.left}%`, transform: 'translateX(-50%)' }}
                    />
                    
                    <div className="relative w-[90%] max-w-[340px] bg-white rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/5 flex justify-between items-center z-20">
                      <div>
                        <p className="text-[12px] font-bold text-[#f66b1e] mb-1">
                          {step.status === "locked" ? t.start.locked : step.status === "active" ? t.start.todayExpression : t.start.completed}
                        </p>
                        <p className="text-[16px] font-black text-[#222222] flex items-center gap-1">
                          {step.status != "locked" && step.wordKorean && (
                            <span className="text-[#f66b1e]">
                              "{step.wordKorean}"
                            </span>
                          )}
                          {step.status === "locked" ? t.start.lockedDesc : step.status === "active" ? t.start.study : t.start.review}
                        </p>
                      </div>

                      {step.status !== "locked" && (
                        <div className="w-10 h-10 rounded-full bg-[#fff5ef] flex items-center justify-center shrink-0 ml-4">
                          <ChevronRight size={20} strokeWidth={3} className="text-[#f66b1e]" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dduck (Rice Cake) Image scattered in empty space */}
              {nextStep && (() => {
                const rand = pseudoRandom(step.id);
                const rand2 = pseudoRandom(step.id + 100);
                const rand3 = pseudoRandom(step.id + 200);

                let safeLeft;
                if (step.left >= 60) {
                  safeLeft = 15 + rand * 20; // 15% to 35%
                } else if (step.left <= 40) {
                  safeLeft = 65 + rand * 20; // 65% to 85%
                } else {
                  safeLeft = rand > 0.5 ? 10 + rand2 * 15 : 75 + rand2 * 15; // 10-25% or 75-90%
                }
                
                const randomTop = 10 + rand2 * 70; // 10px to 80px
                const randomRotate = -40 + rand3 * 80; // -40deg to 40deg

                return (
                  <div 
                    className="absolute z-0 pointer-events-none drop-shadow-md opacity-90"
                    style={{
                      width: '56px',
                      height: '56px',
                      top: `${randomTop}px`,
                      left: `${safeLeft}%`,
                      transform: `translateX(-50%) rotate(${randomRotate}deg)`
                    }}
                  >
                    <Image src={`/assets/dduck${(index % 3) + 1}.png`} alt="떡" fill sizes="56px" className="object-contain" />
                  </div>
                );
              })()}
            </div>
          );
        })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
