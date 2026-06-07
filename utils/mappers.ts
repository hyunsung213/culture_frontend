import { ApiWord, ApiFeedbackResponse, ApiSavedExpression } from "../types/api";
import { Expression, Feedback, SavedExpression } from "../types/expression";

export function mapWordToExpression(apiWord: ApiWord): Expression {
  const example = apiWord.examples?.[0];
  
  return {
    id: apiWord.id,
    korean: apiWord.korean,
    romanization: apiWord.romanization,
    label: "Word of the Day",
    shortMeaningKo: apiWord.shortMeaningKo || apiWord.cultureNote || "",
    shortMeaningEn: apiWord.shortMeaningEn || "",
    modelSentenceKo: example?.exampleKo || "예문이 없습니다.",
    modelSentenceEn: example?.exampleEn || "",
    usageTip: apiWord.usageTip || "이 표현은 자연스러운 맥락에서 사용해보세요.",
  };
}

export function mapFeedbackResponse(apiFeedback: ApiFeedbackResponse): Feedback {
  // If the server suggests a better grammar or meaning, use it as natural expression.
  // Otherwise, fallback to the original sentence or TPO "best_fit" if available.
  const naturalExpr =
    apiFeedback.grammar?.suggestion ||
    apiFeedback.meaning?.suggestion ||
    apiFeedback.original_sentence;

  return {
    originalSentence: apiFeedback.original_sentence,
    title: "문장 검증 완료!",
    meaningFeedback: apiFeedback.meaning?.reason || "의미가 자연스럽습니다.",
    meaningCorrect: apiFeedback.meaning?.correct ?? true,
    meaningSuggestion: apiFeedback.meaning?.suggestion,
    grammarFeedback: apiFeedback.grammar?.reason || "문법적으로 올바릅니다.",
    grammarCorrect: apiFeedback.grammar?.correct ?? true,
    grammarSuggestion: apiFeedback.grammar?.suggestion,
    naturalExpression: naturalExpr,
    tpoBestFit: apiFeedback.tpo?.best_fit || "알 수 없음",
    politeExpression: apiFeedback.tpo?.공적 || naturalExpr,
    casualExpression: apiFeedback.tpo?.사적 || naturalExpr,
    writingExpression: apiFeedback.tpo?.반격식 || naturalExpr,
    tip: apiFeedback.summary || "이 표현을 활용해 실제 대화에 적용해 보세요.",
    tags: [],
    // We also need to keep the IDs for saving later
    meta: {
      userSentenceId: apiFeedback.meta?.user_sentence_id || "",
      feedbackResultId: apiFeedback.meta?.feedback_result_id || "",
    }
  };
}

export function mapSavedExpression(apiSaved: ApiSavedExpression): SavedExpression {
  return {
    id: apiSaved.id,
    word: apiSaved.word?.korean || "단어",
    romanization: apiSaved.word?.romanization || "",
    originalSentence: apiSaved.originalSentence,
    correctedSentence: apiSaved.savedExpression,
    tags: [],
    createdAt: new Date(apiSaved.createdAt).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  };
}
