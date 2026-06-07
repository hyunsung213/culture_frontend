import { Expression, Feedback, SavedExpression } from "../types/expression";

export const dummyExpression: Expression = {
  id: "jeong",
  korean: "정",
  romanization: "Jeong",
  label: "Word of the Day",
  shortMeaningKo: "마음이 통하는 따뜻한 정, 사람과 사람 사이의 깊은 유대감",
  shortMeaningEn: "A warm, heartfelt bond and deep connection between people.",
  modelSentenceKo: "깊은 말로 다 할 수 없지만, 마음으로 전해져요.",
  modelSentenceEn: "Though jeong cannot be fully spoken, it is deeply felt in the heart.",
  usageTip:
    "‘정’은 오래 함께한 시간, 따뜻한 기억, 사람 사이의 애착을 표현할 때 자연스럽게 사용됩니다.",
};

export const dummyFeedback: Feedback = {
  originalSentence: "나는 이 카페를 정이 들었다.",
  title: "문장 검증 완료!",
  meaningFeedback:
    "‘정’이 어떤 대상에 대해 따뜻한 애착이 생긴다는 의미로 사용된 점은 좋습니다.",
  grammarFeedback:
    "‘정이 들다’는 장소와 함께 사용할 때 보통 조사 ‘에’를 사용합니다.",
  naturalExpression: "이 카페에 자주 오다 보니까 정들었어요.",
  tpoBestFit: "이 카페에 자주 오다 보니까 정들었어요.",
  politeExpression: "이 카페에 자주 오다 보니 정이 들었어요.",
  casualExpression: "나 여기 이제 좀 정들었어.",
  writingExpression: "이 카페에 자주 오다 보니 어느새 정이 들었다.",
  tip:
    "‘정’은 직접 설명하기보다, 오래 함께한 시간이나 따뜻한 기억과 함께 쓰면 더 자연스럽습니다.",
  tags: ["조사 오류", "표현 결합", "구어체 개선"],
  meaningCorrect: true,
  grammarCorrect: false,
};

export const dummySavedExpressions: SavedExpression[] = [
  {
    id: "saved-1",
    word: "정",
    romanization: "Jeong",
    originalSentence: "나는 이 카페를 정이 들었다.",
    correctedSentence: "이 카페에 자주 오다 보니까 정들었어요.",
    tags: ["조사 오류", "구어체"],
    createdAt: "2026.05.25",
  },
  {
    id: "saved-2",
    word: "눈치",
    romanization: "Nunchi",
    originalSentence: "그는 눈치가 빠르게 알았다.",
    correctedSentence: "그는 눈치가 빨라서 금방 알아챘어요.",
    tags: ["표현 결합", "자연스러움"],
    createdAt: "2026.05.24",
  },
];
