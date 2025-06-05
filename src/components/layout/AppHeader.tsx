"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import HeaderRightActions from "../header/HeaderRightActions";
import { AppLogo } from "./AppLogo";

interface AppHeaderProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export function AppHeader({ isMobileMenuOpen, onMobileMenuToggle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-background-secondary shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <AppLogo />
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