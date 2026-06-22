import { Feedback } from "../../types/expression";
import BottomButton from "../layout/BottomButton";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";

interface FeedbackScreenProps {
  feedback: Feedback;
  onNext: () => void;
  onRetry?: () => void;
}

// 교정문에서 달라진 단어를 하이라이트 (교정문 전용)
function diffChars(original: string, corrected: string) {
  const origWords = original.split(/(\s+)/);
  const corrWords = corrected.split(/(\s+)/);

  const m = origWords.length;
  const n = corrWords.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (origWords[i - 1] === corrWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const corrResult: { text: string; changed: boolean }[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origWords[i - 1] === corrWords[j - 1]) {
      corrResult.unshift({ text: corrWords[j - 1], changed: false });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      corrResult.unshift({ text: corrWords[j - 1], changed: true });
      j--;
    } else {
      i--;
    }
  }

  return corrResult;
}

function CorrectedText({ parts }: { parts: { text: string; changed: boolean }[] }) {
  return (
    <span className="text-[15px] font-semibold leading-relaxed">
      {parts.map((part, i) =>
        part.text.trim() === "" ? (
          <span key={i}>{part.text}</span>
        ) : part.changed ? (
          <span
            key={i}
            className="text-[#222222] bg-[#ffe484] rounded px-1 py-0.5 font-bold"
          >
            {part.text}
          </span>
        ) : (
          <span key={i} className="text-[#222222]">{part.text}</span>
        )
      )}
    </span>
  );
}

function parseFeedbackReason(text: string) {
  if (!text) return { displayReason: text, sourceText: null };

  let displayReason = text;

  // 1. [판단] 뒷부분만 정확히 추출
  const judgmentMatch = text.match(/\[판단\]\s*([\s\S]*?)(?=\n\[|$)/);
  if (judgmentMatch) {
    displayReason = judgmentMatch[1].trim();
  } else {
    displayReason = text.trim();
  }

  // 2. 출처 추출
  let sources: string[] = [];
  
  // (A) 명시적인 [출처] 태그가 있는 경우
  const sourceMatch = text.match(/\[출처\]\s*(.*?)(?=\n\[|$)/);
  if (sourceMatch) {
    // "한국어기초사전, 우리말샘" 등을 파싱
    sources = sourceMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  } else {
    // (B) 텍스트 내에 [기관명] 형태로 들어있는 경우
    const skipKeywords = ["단어", "품사", "발음", "뜻", "판단", "의미", "문법", "제안", "교정", "출처", "원문"];
    const allBrackets = text.match(/\[([^\]]+)\]/g);
    if (allBrackets) {
      for (const bracket of allBrackets) {
        const inner = bracket.slice(1, -1).trim();
        if (!skipKeywords.includes(inner)) {
          if (!sources.includes(inner)) {
            sources.push(inner);
          }
        }
      }
    }
  }

  // 3. [판단] 내용에서 기관명 및 조사 제거
  if (sources.length > 0) {
    const sourcesPattern = sources.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const removeRegex = new RegExp(`(?:\\[(?:${sourcesPattern})\\][\\s과와및,]*)+(?:에\\s*따르면|에서|에\\s*의하면|의\\s*설명에\\s*의하면|의\\s*정의에\\s*따르면|을\\s*참고하면|을\\s*보면|의\\s*경우|에\\s*따라)?\\s*`, 'g');
    displayReason = displayReason.replace(removeRegex, '').trim();
  }

  return {
    displayReason,
    sourceText: sources.length > 0 ? `출처: ${sources.join(', ')}` : null
  };
}

interface FeedbackCardProps {
  title: string;
  reason: string;
  isCorrect?: boolean;
  correctLabel: string;
  needsCorrectionLabel: string;
  icon: string;
}

function FeedbackCard({ title, reason, isCorrect, correctLabel, needsCorrectionLabel, icon }: FeedbackCardProps) {
  const correct = isCorrect !== false;
  const { displayReason, sourceText } = parseFeedbackReason(reason);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-[16px] p-4 ${correct ? 'bg-[#f8f8f8] border border-[#ebebeb]' : 'bg-[#fef8f6] border border-[#f5e0d5]'}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-[18px] mt-0.5 flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-bold text-[#222222] text-[14px]">{title}</h3>
            {correct ? (
              <div className="flex items-center gap-1 text-[#3ba55d] text-[11px] font-bold">
                <CheckCircle2 size={13} />
                {correctLabel}
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[#e0734a] text-[11px] font-bold">
                <XCircle size={13} />
                {needsCorrectionLabel}
              </div>
            )}
          </div>
          <p className="text-[#555555] leading-relaxed text-[13px]">{displayReason}</p>
          {sourceText && (
            <p className="text-[#999999] text-[11px] mt-2.5 pt-2.5 border-t border-[#0000000a]">
              {sourceText}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function FeedbackScreen({ feedback, onNext, onRetry }: FeedbackScreenProps) {
  const { t } = useLanguage();

  const correctedSentence = feedback.grammarSuggestion || feedback.meaningSuggestion || null;
  const hasDiff = correctedSentence && correctedSentence !== feedback.originalSentence;
  const corrResult = hasDiff ? diffChars(feedback.originalSentence, correctedSentence) : [];

  return (
    <div className="flex flex-col flex-1 w-full bg-[#fafafa] overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-3 flex-shrink-0 z-10 bg-white">
        <div className="h-1.5 w-full bg-[#f0f0f0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#f66b1e] transition-all duration-300 ease-in-out rounded-full"
            style={{ width: "90%" }}
          />
        </div>
      </div>

      <div className="px-5 flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full py-4 pb-10"
        >
          {/* 타이틀 */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-full bg-[#f66b1e]/10 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-[#f66b1e]" />
            </div>
            <h2 className="text-[19px] font-bold text-[#222222]">{t.learn.verifyComplete}</h2>
          </div>

          {/* 문장 비교 카드 */}
          <div className="rounded-[16px] bg-white border border-[#eee] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden mb-5">
            {/* 내가 쓴 문장 */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="text-[11px] font-bold text-[#999] uppercase tracking-wider">{t.learn.mySentenceTitle}</span>
              </div>
              <p className="text-[#333] font-medium text-[15px] leading-relaxed">
                &ldquo;{feedback.originalSentence}&rdquo;
              </p>
            </div>

            {/* AI 교정 문장 */}
            {hasDiff && (
              <>
                <div className="mx-5 border-t border-[#f0f0f0]" />
                <div className="px-5 pt-4 pb-5 bg-[#fffdf7]">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Sparkles size={12} className="text-[#f66b1e]" />
                    <span className="text-[11px] font-bold text-[#f66b1e] uppercase tracking-wider">{t.learn.aiCorrected}</span>
                  </div>
                  <CorrectedText parts={corrResult} />
                </div>
              </>
            )}

            {/* 교정 없을 때 */}
            {!hasDiff && (
              <>
                <div className="mx-5 border-t border-[#f0f0f0]" />
                <div className="px-5 py-3.5 bg-[#f8f8f8]">
                  <div className="flex items-center gap-1.5 text-[#3ba55d] text-[13px] font-semibold">
                    <CheckCircle2 size={14} />
                    {t.learn.perfectSentence}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 상세 피드백 카드들 */}
          <div className="space-y-3">
            <FeedbackCard
              icon="💬"
              title={t.learn.meaningFeedback}
              reason={feedback.meaningFeedback}
              isCorrect={feedback.meaningCorrect}
              correctLabel={t.learn.correct}
              needsCorrectionLabel={t.learn.needsCorrection}
            />
            <FeedbackCard
              icon="✏️"
              title={t.learn.grammarFeedback}
              reason={feedback.grammarFeedback}
              isCorrect={feedback.grammarCorrect}
              correctLabel={t.learn.correct}
              needsCorrectionLabel={t.learn.needsCorrection}
            />
          </div>
        </motion.div>
      </div>

      {!feedback.meaningCorrect ? (
        <BottomButton onClick={onRetry} variant="outline">
          {t.learn.rewriteSentence}
        </BottomButton>
      ) : (
        <BottomButton onClick={onNext} variant="outline">
          {t.learn.learnNatural}
        </BottomButton>
      )}
    </div>
  );
}
