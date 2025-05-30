"use client";
import { useState, useEffect } from "react";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  VideoCameraIcon,
  UserIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PanelLeftClose, PanelRightClose } from "lucide-react";

import HeaderRightActions from "./header/HeaderRightActions";
import SubscriptionMinutes from "./header/SubscriptionMinutes";

import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { getSubscriptionMinutes } from "@/services/mock/subscription";
import { handleSignOut } from "@/helpers/auth.helper";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [subscription, setSubscription] = useState<{
    used: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getSubscriptionMinutes();
        setSubscription(data);
      } catch (error) {
        console.error("Failed to fetch subscription data:", error);
      }
    };

    fetchSubscription();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", href: "/app" },
    { icon: VideoCameraIcon, label: "Interviews", href: "/app/interviews" },
    { icon: MagnifyingGlassIcon, label: "Discover", href: "/app/discover" },
    { icon: CreditCardIcon, label: "Pricing", href: "/app/pricing" },
  ];

  const handleSidebarToggle = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-background-secondary shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center">
            <Link href="/app" className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="text-primary">Prep</span>
                <span className="text-foreground">ilo</span>
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {subscription && (
              <div className="hidden md:block">
                <SubscriptionMinutes subscription={subscription} />
              </div>
            )}
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
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                    isActive(href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground-secondary hover:bg-background-secondary/50 hover:text-foreground"
                  )}
                  href={href}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4 space-y-4">
              {subscription && (
                <div className="md:hidden">
                  <SubscriptionMinutes subscription={subscription} />
                </div>
              )}
              <div className="md:hidden">
                <HeaderRightActions />
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-colors duration-200"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile */}
        <aside
          className={cn(
            "hidden md:block bg-background-secondary",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
              {menuItems.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                    isActive(href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground-secondary hover:bg-background-secondary/50 hover:text-foreground"
                  )}
                  href={href}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-200",
                      isActive(href)
                        ? "text-primary"
                        : "text-foreground-secondary group-hover:text-foreground"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{label}</span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 space-y-1">
              <button
                onClick={handleSignOut}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  "text-error hover:bg-error/10 transition-colors duration-200"
                )}
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">Logout</span>
                )}
              </button>

              <button
                onClick={handleSidebarToggle}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  "text-foreground-secondary hover:bg-background-secondary/50 hover:text-foreground transition-colors duration-200"
                )}
              >
                {isCollapsed ? (
                  <PanelRightClose className="h-5 w-5 shrink-0" />
                ) : (
                  <PanelLeftClose className="h-5 w-5 shrink-0" />
                )}
                {!isCollapsed && (
                  <span className="truncate">Collapse</span>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
