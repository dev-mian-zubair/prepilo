"use client";
import { useState, useEffect } from "react";
import { Link } from "@heroui/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import HeaderRightActions from "./header/HeaderRightActions";
import { APP_CONFIG } from "@/config/app";
import { cn } from "@/lib/utils";
import { handleSignOut } from "@/helpers/auth.helper";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const menuItems = APP_CONFIG.navigation.main;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navbar */}
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-background/80 backdrop-blur-md transition-opacity md:hidden",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 right-0 w-full max-w-xs bg-content1 transition-transform duration-300",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">Menu</h2>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  className={cn(
                    "flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200",
                    isActive(href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground-secondary hover:bg-background-secondary/50 hover:text-foreground"
                  )}
                  href={href}
                >
                  <Icon className="h-6 w-6 shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4 space-y-4">
              <div className="md:hidden">
                <HeaderRightActions />
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-base font-medium text-error hover:bg-error/10 transition-colors duration-200"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden md:block bg-background-secondary p-6 w-72">
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {menuItems.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200",
                    isActive(href)
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-foreground-secondary hover:bg-background-secondary/50 hover:text-foreground"
                  )}
                  href={href}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 shrink-0 transition-colors duration-200",
                      isActive(href)
                        ? "text-primary"
                        : "text-foreground-secondary group-hover:text-foreground"
                    )}
                  />
                  <span className="truncate">{label}</span>
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium",
                  "text-error hover:bg-error/10 transition-all duration-200"
                )}
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" />
                <span className="truncate">Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
