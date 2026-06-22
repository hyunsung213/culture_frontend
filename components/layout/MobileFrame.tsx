import { ReactNode } from "react";
import clsx from "clsx";

interface MobileFrameProps {
  children: ReactNode;
  className?: string;
}

export default function MobileFrame({ children, className }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-sub-background flex items-center justify-center sm:py-8">
      <div
        className={clsx(
          "w-full max-w-[390px] h-[100dvh] sm:h-[844px] sm:max-h-[min(844px,95vh)] bg-background relative flex flex-col overflow-hidden sm:rounded-[36px] sm:border-[8px] sm:border-gray-900 sm:shadow-2xl",
          className
        )}
      >
        <div className="relative flex-1 w-full h-full flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
