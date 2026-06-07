"use client";

import { useState, use, useEffect } from "react";
import AppHeader from "@/components/layout/AppHeader";
import SavedExpressionCard from "@/components/cards/SavedExpressionCard";
import { getSavedExpressions, fetchWordsSummary } from "@/lib/api";
import { mapSavedExpression } from "@/utils/mappers";
import { getCachedData } from "@/lib/dataCache";
import BottomNav from "@/components/layout/BottomNav";
import { SavedExpression } from "@/types/expression";

export default function DictionaryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('saved');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-full bg-sub-background" />;
  }
  
  let savedExpressions = [] as SavedExpression[];
  if (activeTab === 'saved') {
    const rawSaved = use(getCachedData('saved', getSavedExpressions));
    const dedupedSaved = [];
    const seenWordIds = new Set<string>();
    for (const expr of rawSaved) {
      if (!seenWordIds.has(expr.wordId)) {
        seenWordIds.add(expr.wordId);
        dedupedSaved.push(expr);
      }
    }
    savedExpressions = dedupedSaved.map(mapSavedExpression);
  }

  const allWords = activeTab === 'all' ? use(getCachedData('all', fetchWordsSummary)) : [];

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      
      {/* Absolute Header Overlay */}
      <div className="absolute top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md pb-4">
        <AppHeader title="학습 사전" backHref="/" />
        
        {/* Tabs */}
        <div className="flex px-5 mt-2 space-x-4 border-b border-gray-200">
          <button 
            className={`pb-2 text-[15px] font-bold transition-colors ${activeTab === 'saved' ? 'text-[#f66b1e] border-b-2 border-[#f66b1e]' : 'text-[#575757]'}`}
            onClick={() => setActiveTab('saved')}
          >
            내 사전
          </button>
          <button 
            className={`pb-2 text-[15px] font-bold transition-colors ${activeTab === 'all' ? 'text-[#f66b1e] border-b-2 border-[#f66b1e]' : 'text-[#575757]'}`}
            onClick={() => setActiveTab('all')}
          >
            전체 단어
          </button>
        </div>

        <div className="px-5 mt-4">
          <h1 className="text-xl font-bold text-text-main">총 {activeTab === 'all' ? allWords.length : savedExpressions.length}개</h1>
          <p className="text-text-sub text-xs mt-0.5">
            {activeTab === 'all' ? "전체 학습 가능한 표현들이에요" : "지금까지 학습한 표현들이에요"}
          </p>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="absolute inset-0 pb-[80px] w-full overflow-y-auto [&::-webkit-scrollbar]:hidden pt-[180px]">
        <div className="p-5">
          {activeTab === 'saved' ? (
            savedExpressions.map((expression) => (
              <SavedExpressionCard key={expression.id} expression={expression} />
            ))
          ) : (
            allWords.map((word) => (
              <div key={word.id} className="bg-white rounded-[10px] p-6 border border-black/5 shadow-[0_1px_4px_rgba(12,12,13,0.05),_0_1px_4px_rgba(12,12,13,0.1)] mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-[24px] font-extrabold text-[#f66b1e] flex items-baseline gap-3">
                    {word.korean}
                    <span className="text-[15px] font-normal text-[#575757]">{word.romanization}</span>
                  </h2>
                  <span className="bg-[#f66b1e]/10 text-[#f66b1e] text-[11px] px-2 py-1 rounded-full font-bold">
                    {word.difficulty}
                  </span>
                </div>
                <p className="text-[#222222] font-bold text-[15px] mb-1">{word.englishTitle}</p>
                <div className="mt-4 space-y-1">
                  <p className="text-[13px] text-[#575757] leading-relaxed">{word.shortMeaningKo}</p>
                  <p className="text-[13px] text-[#575757] italic leading-relaxed">{word.shortMeaningEn}</p>
                </div>
              </div>
            ))
          )}
          
          {activeTab === 'saved' && savedExpressions.length === 0 && (
            <p className="text-center text-text-sub mt-10">아직 저장된 표현이 없습니다.</p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
