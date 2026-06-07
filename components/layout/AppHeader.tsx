import { ChevronLeft } from "lucide-react";
import IconButton from "../common/IconButton";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../context/LanguageContext";

interface AppHeaderProps {
  title?: string;
  onBack?: () => void;
  backHref?: string;
  rightAction?: React.ReactNode;
}

export default function AppHeader({ title, onBack, backHref, rightAction }: AppHeaderProps) {

  const showLogo = [
    "오늘의 표현",
    "예시 문장",
    "문장 작성",
    "AI 피드백",
    "자연스러운 표현",
    "나만의 표현 사전"
  ].includes(title || "");

  return (
    <header className="flex items-center justify-between px-5 h-14 shrink-0 bg-transparent z-10 sticky top-0">
      <div className="flex-1">
        {onBack ? (
          <IconButton onClick={onBack} icon={<ChevronLeft size={24} />} ariaLabel="Go back" />
        ) : backHref ? (
          <Link href={backHref} className="inline-flex p-2 -ml-2 text-text-main hover:bg-sub-background rounded-full transition-colors">
            <ChevronLeft size={24} />
          </Link>
        ) : null}
      </div>
      <div className="flex-[2] flex justify-center items-center gap-1.5 text-lg font-semibold text-text-main whitespace-nowrap">
        {title}
        {showLogo && (
          <div className="relative w-6 h-6 -mt-0.5">
            <Image src="/assets/logo_mini.png" alt="Logo" fill className="object-contain" />
          </div>
        )}
      </div>
      <div className="flex-1 flex justify-end items-center gap-2">
        {rightAction}
      </div>
    </header>
  );
}
