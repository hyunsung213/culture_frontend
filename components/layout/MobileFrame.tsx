import { ReactNode } from "react";
import clsx from "clsx";

interface MobileFrameProps {
  children: ReactNode;
  className?: string;
}

export default function MobileFrame({ children, className }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-sub-background flex justify-center">
      <div
        className={clsx(
          "w-full max-w-[390px] h-[100dvh] bg-background relative shadow-sm flex flex-col overflow-hidden",
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
