"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronLeft } from "lucide-react";
import StartScreen from "@/components/learn/StartScreen";
import WordIntroScreen from "@/components/learn/WordIntroScreen";
import WritingScreen from "@/components/learn/WritingScreen";
import FeedbackScreen from "@/components/learn/FeedbackScreen";
import NaturalExpressionScreen from "@/components/learn/NaturalExpressionScreen";
import CompleteScreen from "@/components/learn/CompleteScreen";
import { Expression, Feedback } from "@/types/expression";
import { fetchTodayWord, startLearningLog, submitSentenceFeedback, saveExpression, completeLearningLog, fetchWordById, resetLearningLogs } from "@/lib/api";
import { mapWordToExpression, mapFeedbackResponse } from "@/utils/mappers";

export default function Home() {
  const [step, setStep] = useState(0);
  const [showPreparing, setShowPreparing] = useState(false);
  const [hideCelebration, setHideCelebration] = useState(false);
  const [expression, setExpression] = useState<Expression | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/splash");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const loadWordData = async () => {
    try {
      const response = await fetchTodayWord();
      if (response.word) {
        setExpression(mapWordToExpression(response.word));
      } else {
        setExpression(null);
      }
      setProgress(response.progress);
    } catch (err) {
      console.error("Failed to fetch today's word:", err);
    }
  };

  useEffect(() => {
    loadWordData();
  }, []);

  const handleStartLearning = async () => {
    if (!expression) return;
    try {
      await startLearningLog(expression.id);
    } catch (err) {
      console.error("Failed to log learning start:", err);
    }
    setStep(1);
  };

  const handleReviewWord = async (wordId: string) => {
    try {
      const apiWord = await fetchWordById(wordId);
      setExpression(mapWordToExpression(apiWord));
      try {
        await startLearningLog(apiWord.id);
      } catch (e) {
        console.error("Failed to log learning start for review:", e);
      }
      setStep(1);
    } catch (err) {
      console.error("Failed to fetch word for review:", err);
    }
  };

  const handleVerifySentence = async (sentence: string) => {
    if (!expression) return;
    setIsLoadingFeed(true);
    setError(null);
    try {
      const result = await submitSentenceFeedback(expression.id, sentence);
      setFeedback(mapFeedbackResponse(result));
      setStep(4);
    } catch (err: any) {
      console.error("Failed to verify sentence:", err);
      setStep(4);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const handleCompleteLearning = async () => {
    if (!expression || !feedback?.meta) return;
    
    try {
      // Save the expression first
      await saveExpression({
        wordId: expression.id,
        userSentenceId: feedback.meta.userSentenceId,
        feedbackResultId: feedback.meta.feedbackResultId,
        savedExpression: feedback.naturalExpression,
        memo: "자연스러운 표현 학습에서 자동 저장됨",
      });

      // Complete the learning log
      await completeLearningLog(expression.id);
    } catch (err) {
      console.error("Failed to complete learning:", err);
    }
    
    setStep(6);
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const restart = () => {
    setStep(0);
    loadWordData(); // Refetch to get the next word in sequence
  };

  const getHeaderTitle = () => {
    switch (step) {
      case 0: return "";
      case 1: return t.learn.wordOfTheDay;
      case 2: return t.learn.wordOfTheDay;
      case 3: return t.learn.writing;
      case 4: return t.learn.aiFeedback;
      case 5: return t.learn.naturalExpression;
      case 6: return t.learn.learningComplete;
      default: return "";
    }
  };

  if (isAuthLoading || !isAuthenticated) {
    return <div className="flex flex-col h-full bg-[#fefefe]"></div>;
  }

  if (step > 0 && !expression) {
    return (
      <div className="flex flex-col h-full bg-[#fefefe] items-center justify-center">
        <p>{t.common.loadingData}</p>
      </div>
    );
  }

  // Handle all completed
  if (step === 0 && progress?.allCompleted && !hideCelebration) {
    if (showPreparing) {
      return (
        <div className="flex flex-col h-full bg-background relative overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-[#f66b1e]/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🚀</span>
            </div>
            <h2 className="text-xl font-bold text-[#222222] mb-2 whitespace-pre-line leading-relaxed">
              {t.learn.preparingNewWords}
            </h2>
          </div>
          
          <div className="px-6 pb-6">
            <button
              onClick={async () => {
                setShowPreparing(false);
                setHideCelebration(false);
                try {
                  await resetLearningLogs();
                  loadWordData();
                  setStep(0);
                } catch (error) {
                  console.error("Failed to reset logs", error);
                }
              }}
              className="w-full bg-[#f66b1e] text-white h-14 rounded-full font-bold text-lg shadow-md hover:bg-[#e05a12] transition-colors"
            >
              {t.learn.home}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-background relative overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-[#f66b1e]/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-2xl font-black text-[#222222] mb-2">{t.learn.allCompletedTitle}</h2>
          <p className="text-[#575757] text-[15px] leading-relaxed whitespace-pre-line">
            {t.learn.allCompletedDesc}
          </p>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={() => setShowPreparing(true)}
            className="w-full bg-[#f66b1e] text-white h-14 rounded-full font-bold text-lg shadow-md hover:bg-[#e05a12] transition-colors"
          >
            {t.learn.next}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {step > 0 && (
        <div className="px-5 flex items-center pt-6 pb-4 relative shrink-0">
          <button 
            onClick={step === 6 ? restart : prevStep} 
            className="absolute left-3 p-2 text-text-main hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-1.5 w-full justify-center">
            <h1 className="text-[20px] font-bold text-[#222222]">{getHeaderTitle()}</h1>
            <img src="/assets/logo_mini.png" alt="Logo" className="w-6 h-6 object-contain -mt-0.5" />
          </div>
        </div>
      )}

      {step === 0 && <StartScreen expression={expression} progress={progress} onNext={handleStartLearning} onReview={handleReviewWord} />}
      {step === 1 && expression && <WordIntroScreen expression={expression} mode="meaning" onNext={nextStep} />}
      {step === 2 && expression && <WordIntroScreen expression={expression} mode="example" onNext={nextStep} />}
      
      {/* We need to update WritingScreen to accept onSubmit instead of onNext? Wait, let's look at WritingScreen API. It takes expression and onNext. */}
      {step === 3 && expression && (
        <WritingScreen 
          expression={expression} 
          onNext={() => {}} 
          onSubmit={handleVerifySentence}
          isLoading={isLoadingFeed}
          error={error}
        />
      )}
      
      {step === 4 && feedback && <FeedbackScreen feedback={feedback} onNext={nextStep} onRetry={() => setStep(3)} />}
      {step === 5 && feedback && <NaturalExpressionScreen feedback={feedback} onNext={handleCompleteLearning} />}
      {step === 6 && expression && feedback && <CompleteScreen expression={expression} feedback={feedback} onRestart={restart} />}
    </div>
  );
}
