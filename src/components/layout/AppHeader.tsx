"use client";
import { Link } from "@heroui/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { APP_CONFIG } from "@/config/app";
import HeaderRightActions from "../header/HeaderRightActions";

interface AppHeaderProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export function AppHeader({ isMobileMenuOpen, onMobileMenuToggle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-background-secondary shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <Link 
            href="/app" 
            className="flex items-center gap-2.5 group transition-all duration-200 hover:opacity-90"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-lg blur-sm group-hover:blur-md transition-all duration-200" />
              <div className={`relative bg-gradient-to-br ${APP_CONFIG.logo.gradient} rounded-lg p-2.5 shadow-sm`}>
                <span className="text-white text-xl font-bold tracking-tight">{APP_CONFIG.logo.text}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="text-primary">Prep</span>
                <span className="text-foreground">ilo</span>
              </h1>
              <span className="text-xs text-foreground/60 -mt-1">{APP_CONFIG.title}</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <HeaderRightActions />
          </div>
          <button
            className="md:hidden p-2 rounded-lg text-foreground-secondary hover:bg-background-secondary/50 hover:text-foreground"
            onClick={onMobileMenuToggle}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
} 