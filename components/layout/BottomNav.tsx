import { Home, BookOpen, User } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTransition } from "@/context/TransitionContext";
import { useLanguage } from "@/context/LanguageContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { navigateTo } = useTransition();
  const { t } = useLanguage();

  const tabs = [
    { name: t.nav.dictionary, href: "/dictionary", icon: BookOpen },
    { name: t.nav.home, href: "/", icon: Home },
    { name: t.nav.mypage, href: "/mypage", icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full h-[65px] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 flex justify-around items-center px-4 z-[100]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.name}
            onClick={() => navigateTo(tab.href)}
            className="flex flex-col items-center justify-center gap-1 w-16"
          >
            <div className="relative">
              <Icon 
                size={24} 
                className={clsx(
                  "transition-colors duration-200",
                  isActive ? "text-primary" : "text-gray-400"
                )} 
              />
            </div>
            <span 
              className={clsx(
                "text-[11px] font-medium transition-colors duration-200",
                isActive ? "text-primary font-bold" : "text-gray-400"
              )}
            >
              {tab.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
