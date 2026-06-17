"use client";

import { useState, use, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import SavedExpressionCard from "@/components/cards/SavedExpressionCard";
import { getSavedExpressions, fetchWordsSummary } from "@/lib/api";
import { mapSavedExpression } from "@/utils/mappers";
import { getCachedData } from "@/lib/dataCache";
import BottomNav from "@/components/layout/BottomNav";
import { SavedExpression } from "@/types/expression";
import { useTransition } from "@/context/TransitionContext";
import { useLanguage } from "@/context/LanguageContext";

export default function DictionaryPage() {
  const { navigateTo } = useTransition();
  const { t } = useLanguage();
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
      
      {/* Scrollable Container */}
      <div className="absolute inset-0 pb-[80px] w-full overflow-y-auto [&::-webkit-scrollbar]:hidden pt-6">
        
        {/* Page Title & Back Button */}
        <div className="px-5 flex items-center mb-8 relative">
          <button onClick={() => navigateTo("/")} className="absolute left-3 p-2 text-text-main hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-1.5 w-full justify-center">
            <h1 className="text-[20px] font-bold text-[#222222]">{t.dictionary.title}</h1>
            <img src="/assets/logo_mini.png" alt="Logo" className="w-6 h-6 object-contain -mt-0.5" />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex px-5 space-x-4 border-b border-gray-200">
          <button 
            className={`pb-2 text-[15px] font-bold transition-colors ${activeTab === 'saved' ? 'text-[#f66b1e] border-b-2 border-[#f66b1e]' : 'text-[#575757]'}`}
            onClick={() => setActiveTab('saved')}
          >
            {t.dictionary.myDictionary}
          </button>
          <button 
            className={`pb-2 text-[15px] font-bold transition-colors ${activeTab === 'all' ? 'text-[#f66b1e] border-b-2 border-[#f66b1e]' : 'text-[#575757]'}`}
            onClick={() => setActiveTab('all')}
          >
            {t.dictionary.allWords}
          </button>
        </div>

        <div className="px-5 mt-6 mb-4">
          <h1 className="text-xl font-bold text-text-main">{t.dictionary.totalCount.replace('{count}', String(activeTab === 'all' ? allWords.length : savedExpressions.length))}</h1>
          <p className="text-text-sub text-xs mt-0.5">
            {activeTab === 'all' ? t.dictionary.allWordsDesc : t.dictionary.savedWordsDesc}
          </p>
        </div>

        <div className="px-5">
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
            <p className="text-center text-text-sub mt-10">{t.dictionary.emptySaved}</p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
