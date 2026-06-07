import clsx from "clsx";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface BottomButtonProps {
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export default function BottomButton({
  onClick,
  children,
  disabled = false,
  variant = "primary",
  className,
}: BottomButtonProps) {
  return (
    <div className="p-5 mt-auto bg-background shrink-0 w-full z-10 sticky bottom-0">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          "w-full py-4 rounded-2xl text-lg font-bold transition-colors flex items-center justify-center gap-2 border-2",
          {
            "bg-primary text-white border-primary hover:bg-orange-600": variant === "primary" && !disabled,
            "bg-sub-background text-text-main border-transparent hover:bg-gray-200": variant === "secondary" && !disabled,
            "bg-white text-primary border-primary hover:bg-primary-light": variant === "outline" && !disabled,
            "bg-border text-text-sub border-border cursor-not-allowed opacity-70": disabled,
          },
          className
        )}
      >
        {children}
      </motion.button>
    </div>
  );
}
