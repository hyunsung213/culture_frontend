export interface ApiWordSummary {
  id: string;
  korean: string;
  type: string;
  partOfSpeech: string;
  romanization: string;
  englishTitle: string;
  shortMeaningKo: string;
  shortMeaningEn: string;
  difficulty: string;
  tags: string[];
  sortOrder: number;
}

export interface ApiWordTodayProgress {
  totalWords: number;
  completedWords: number;
  currentOrder: number | null;
  allCompleted: boolean;
}

export interface ApiWordTodayResponse {
  word: ApiWord | null;
  progress: ApiWordTodayProgress;
}

export interface ApiWord {
  id: string;
  korean: string;
  type: string;
  partOfSpeech: string;
  romanization: string;
  englishTitle: string;
  shortMeaningKo: string;
  shortMeaningEn: string;
  usageTip: string;
  difficulty: string;
  tags: string[];
  sortOrder: number;
  cultureNote: string;
  createdAt: string;
  updatedAt: string;
  examples?: {
    id: string;
    exampleKo: string;
    exampleEn: string;
    exampleType: string;
  }[];
  patterns?: {
    id: string;
    patternKo: string;
    descriptionKo: string;
    descriptionEn: string;
  }[];
}

export interface ApiFeedbackResponse {
  original_sentence: string;
  target_word: string;
  grammar: {
    correct: boolean;
    reason: string;
    suggestion: string | null;
  };
  meaning: {
    correct: boolean;
    reason: string;
    suggestion: string | null;
  };
  tpo: {
    best_fit: string;
    reason: string;
    공적?: string;
    사적?: string;
    반격식?: string;
  };
  summary: string;
  meta: {
    user_sentence_id: string;
    feedback_result_id: string;
    request_id?: string;
    score?: number | null;
    feedback_server_version?: string;
  };
}

export interface ApiSavedExpression {
  id: string;
  userId: string;
  wordId: string;
  userSentenceId: string;
  feedbackResultId: string;
  originalSentence: string;
  savedExpression: string;
  memo: string;
  createdAt: string;
  updatedAt: string;
  word?: {
    id: string;
    korean: string;
    romanization: string;
    englishTitle: string;
    shortMeaningKo: string;
    shortMeaningEn: string;
  };
}

export interface ApiLearningLog {
  id: string;
  userId: string;
  wordId: string;
  status: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  word?: {
    id: string;
    korean: string;
    romanization: string;
    englishTitle: string;
    shortMeaningKo: string;
    shortMeaningEn: string;
  };
}

export interface ApiUser {
  id: string;
  loginId: string;
  email: string | null;
  name: string;
  nativeLanguage: string | null;
  koreanLevel: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: ApiUser;
}

export interface ApiMeResponse {
  user: ApiUser;
}

export interface ApiQuizQuestionResponse {
  loginId: string;
  quizQuestion: string;
}

export interface ApiVerifyAnswerResponse {
  verified: boolean;
  resetToken: string;
  expiresIn: number;
}
