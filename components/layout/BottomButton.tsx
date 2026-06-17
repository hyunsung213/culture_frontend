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
          "w-full h-[56px] rounded-[16px] text-[16px] font-bold transition-colors flex items-center justify-center gap-2 border-[1.5px]",
          {
            "bg-[#f66b1e] text-white border-[#f66b1e] hover:bg-[#e05b13] shadow-[0_8px_20px_rgba(246,107,30,0.25)]": variant === "primary" && !disabled,
            "bg-[#f8f8f8] text-[#575757] border-transparent hover:bg-gray-200": variant === "secondary" && !disabled,
            "bg-white text-[#f66b1e] border-[#f66b1e] hover:bg-[#f66b1e]/10 shadow-[0_8px_20px_rgba(246,107,30,0.1)]": variant === "outline" && !disabled,
            "bg-[#e2e4e9] text-[#a0a5b1] border-transparent cursor-not-allowed": disabled,
          },
          className
        )}
      >
        {children}
      </motion.button>
    </div>
  );
}
