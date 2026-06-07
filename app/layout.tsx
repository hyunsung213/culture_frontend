import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileFrame from "@/components/layout/MobileFrame";
import { AuthProvider } from "@/context/AuthContext";
import { TransitionProvider } from "@/context/TransitionContext";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "이응 - AI 한국어 표현 튜터",
  description: "한국어의 감정과 문화를 배우는 AI 표현 튜터",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <LanguageProvider>
            <MobileFrame>
              <TransitionProvider>
                {children}
              </TransitionProvider>
            </MobileFrame>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
