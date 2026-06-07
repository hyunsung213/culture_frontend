"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ko";

interface Translations {
  wordOfTheDay: string;
  meaning: string;
  exampleSentence: string;
  tip: string;
  writeYourSentence: string;
}

const translations: Record<Language, Translations> = {
  en: {
    wordOfTheDay: "Word of the Day",
    meaning: "MEANING",
    exampleSentence: "Example Sentence",
    tip: "TIP",
    writeYourSentence: "Write your own sentence using today’s word.",
  },
  ko: {
    wordOfTheDay: "오늘의 단어",
    meaning: "의미",
    exampleSentence: "예시 문장",
    tip: "참고",
    writeYourSentence: "오늘의 단어를 사용해 문장을 만들어보세요.",
  },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ko");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ko" : "en"));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
