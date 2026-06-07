export interface Expression {
  id: string;
  korean: string;
  romanization: string;
  label: string;
  shortMeaningKo: string;
  shortMeaningEn: string;
  modelSentenceKo: string;
  modelSentenceEn: string;
  usageTip: string;
}

export interface Feedback {
  originalSentence: string;
  title: string;
  meaningFeedback: string;
  meaningCorrect?: boolean;
  meaningSuggestion?: string | null;
  grammarFeedback: string;
  grammarCorrect?: boolean;
  grammarSuggestion?: string | null;
  naturalExpression: string;
  tpoBestFit: string;
  politeExpression: string;
  casualExpression: string;
  writingExpression: string;
  tip: string;
  tags: string[];
  meta?: {
    userSentenceId: string;
    feedbackResultId: string;
  };
}

export interface SavedExpression {
  id: string;
  word: string;
  romanization: string;
  originalSentence: string;
  correctedSentence: string;
  tags: string[];
  createdAt: string;
}
