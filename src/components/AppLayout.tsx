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

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", href: "/app" },
    { icon: VideoCameraIcon, label: "Interviews", href: "/app/interviews" },
    { icon: MagnifyingGlassIcon, label: "Discover", href: "/app/discover" },
    { icon: CreditCardIcon, label: "Pricing", href: "/app/pricing" },
    { icon: UserIcon, label: "Profile", href: "/app/profile" },
    { icon: ChartBarIcon, label: "Analytics", href: "/app/analytics" },
    { icon: Cog6ToothIcon, label: "Settings", href: "/app/settings" },
  ];

  const handleSidebarToggle = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex h-16 items-center px-6">
          <Link href="/app">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-primary">Prep</span>
              <span className="text-gray-900 dark:text-white">ilo</span>
            </h1>
          </Link>
          <div className="flex flex-1 justify-end items-center gap-4">
            {subscription && (
              <SubscriptionMinutes subscription={subscription} />
            )}
            <HeaderRightActions />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
            isCollapsed ? "w-16" : "w-64",
          )}
        >
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
              {menuItems.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive(href)
                      ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50",
                  )}
                  href={href}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive(href)
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-gray-400 dark:text-gray-500",
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
                  "text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/20"
                )}
              >
                <ArrowLeftOnRectangleIcon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    "text-danger-600 dark:text-danger-400"
                  )}
                />
                {!isCollapsed && (
                  <span className="truncate">Logout</span>
                )}
              </button>

              <button
                onClick={handleSidebarToggle}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                )}
              >
                {isCollapsed ? (
                  <PanelRightClose className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" />
                ) : (
                  <PanelLeftClose className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" />
                )}
                {!isCollapsed && (
                  <span className="truncate">Collapse Sidebar</span>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
