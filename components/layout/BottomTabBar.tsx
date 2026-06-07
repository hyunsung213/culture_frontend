import Link from "next/link";
import { Home, BookOpen, User } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function BottomTabBar() {
  const pathname = usePathname();

  const tabs = [
    { name: "학습 사전", href: "/dictionary", icon: BookOpen },
    { name: "홈", href: "/", icon: Home },
    { name: "마이페이지", href: "/mypage", icon: User },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] h-[80px] bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex justify-around items-center px-4 z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        
        return (
          <Link
            key={tab.name}
            href={tab.href}
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
              {isActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
              )}
            </div>
            <span 
              className={clsx(
                "text-[11px] font-medium transition-colors duration-200",
                isActive ? "text-primary font-bold" : "text-gray-400"
              )}
            >
              {tab.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
