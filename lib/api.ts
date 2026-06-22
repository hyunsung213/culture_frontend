import {
  ApiWord,
  ApiFeedbackResponse,
  ApiSavedExpression,
  ApiLearningLog,
  ApiAuthResponse,
  ApiMeResponse,
  ApiQuizQuestionResponse,
  ApiVerifyAnswerResponse,
  ApiWordTodayResponse,
  ApiWordSummary
} from "../types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("accessToken") || "";
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchTodayWord(): Promise<ApiWordTodayResponse> {
  return fetchJson<ApiWordTodayResponse>("/api/words/today");
}

export async function fetchWordById(wordId: string): Promise<ApiWord> {
  return fetchJson<ApiWord>(`/api/words/${wordId}`);
}

export async function fetchWordsSummary(): Promise<ApiWordSummary[]> {
  return fetchJson<ApiWordSummary[]>("/api/words/summary");
}

export async function submitSentenceFeedback(
  wordId: string,
  sentence: string
): Promise<ApiFeedbackResponse> {
  return fetchJson<ApiFeedbackResponse>("/api/feedback", {
    method: "POST",
    body: JSON.stringify({ wordId, sentence }),
  });
}

export async function saveExpression(payload: {
  wordId: string;
  userSentenceId: string;
  feedbackResultId: string;
  savedExpression: string;
  memo?: string;
}): Promise<ApiSavedExpression> {
  return fetchJson<ApiSavedExpression>("/api/saved-expressions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getSavedExpressions(): Promise<ApiSavedExpression[]> {
  return fetchJson<ApiSavedExpression[]>("/api/saved-expressions/me");
}

export async function startLearningLog(wordId: string): Promise<ApiLearningLog> {
  return fetchJson<ApiLearningLog>("/api/learning-logs/start", {
    method: "POST",
    body: JSON.stringify({ wordId }),
  });
}

export async function completeLearningLog(wordId: string): Promise<ApiLearningLog> {
  return fetchJson<ApiLearningLog>("/api/learning-logs/complete", {
    method: "POST",
    body: JSON.stringify({ wordId }),
  });
}

export async function resetLearningLogs(): Promise<void> {
  return fetchJson<void>("/api/learning-logs/me", {
    method: "DELETE",
  });
}

// === Auth APIs ===

export async function register(payload: any): Promise<ApiAuthResponse> {
  return fetchJson<ApiAuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: any): Promise<ApiAuthResponse> {
  return fetchJson<ApiAuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMe(): Promise<ApiMeResponse> {
  return fetchJson<ApiMeResponse>("/api/auth/me");
}

export async function getPasswordQuiz(loginId: string): Promise<ApiQuizQuestionResponse> {
  return fetchJson<ApiQuizQuestionResponse>("/api/auth/password/question", {
    method: "POST",
    body: JSON.stringify({ loginId }),
  });
}

export async function verifyPasswordQuiz(payload: { loginId: string; quizAnswer: string }): Promise<ApiVerifyAnswerResponse> {
  return fetchJson<ApiVerifyAnswerResponse>("/api/auth/password/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: { resetToken: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
  return fetchJson<{ success: boolean; message: string }>("/api/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function pingBackend(): Promise<void> {
  try {
    // Simply to wake up the backend if it's sleeping (e.g., Render/Heroku)
    await fetch(`${API_BASE_URL}/`, { method: "GET" });
  } catch (error) {
    // Ignore errors for ping
  }
}
