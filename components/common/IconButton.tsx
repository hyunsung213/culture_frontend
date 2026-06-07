import { ReactNode } from "react";
import clsx from "clsx";

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  ariaLabel: string;
  className?: string;
}

export default function IconButton({ icon, onClick, ariaLabel, className }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={clsx(
        "p-2 -ml-2 text-text-main hover:bg-sub-background rounded-full transition-colors flex items-center justify-center",
        className
      )}
    >
      {icon}
    </button>
  );
}
