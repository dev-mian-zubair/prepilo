"use client";
import { useState, useEffect } from "react";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
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

  const isActive = (path: string) => {
    return pathname === path;
  };

  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", href: "/app" },
    { icon: VideoCameraIcon, label: "Interviews", href: "/app/interviews" },
    { icon: MagnifyingGlassIcon, label: "Discover", href: "/app/discover" },
    { icon: CreditCardIcon, label: "Pricing", href: "/app/pricing" },
    { icon: UserIcon, label: "Profile", href: "/app/profile" },
    { icon: ChartBarIcon, label: "Analytics", href: "/app/analytics" },
    { icon: Cog6ToothIcon, label: "Settings", href: "/app/settings" },
  ];

  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const buttonStyles = cn(
    "w-full h-10 transition-all duration-200 whitespace-nowrap text-left",
    !isCollapsed && "justify-start",
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <div className="sticky top-0 z-40 w-full bg-background shadow-md shadow-primary-50">
        <div className="flex h-16 items-center px-3">
          <div className="flex items-center gap-2">
            <Button isIconOnly variant="light" onClick={handleSidebarToggle}>
              {/* <Bars3Icon className="w-7 h-7" /> */}
              {isCollapsed ? (
                <PanelRightClose className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </Button>
            <Link className="flex justify-start items-center gap-1" href="/app">
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="text-foreground">Prep</span>ilo
              </h1>
            </Link>
          </div>
          <div className="flex flex-1 justify-end items-center gap-4">
            {subscription && (
              <SubscriptionMinutes subscription={subscription} />
            )}
            <HeaderRightActions />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            "transition-all duration-300 shadow-md shadow-primary-50 pt-5",
            isCollapsed ? "w-14" : "w-56",
          )}
        >
          <div className="flex flex-col">
            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-2">
              {menuItems.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  className={cn(
                    "flex items-center gap-3 rounded-medium px-3 py-2 text-foreground transition-colors",
                    pathname === href
                      ? "bg-default-100 dark:bg-default-300/30 text-foreground font-medium"
                      : "hover:bg-hover/40",
                  )}
                  href={href}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      pathname === href
                        ? "text-foreground"
                        : "text-foreground/70",
                    )}
                  />
                  {!isCollapsed && (
                    <span className="truncate text-sm">{label}</span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Logout */}
            <div className="px-2">
              <Button
                className={buttonStyles}
                color="danger"
                isIconOnly={isCollapsed}
                startContent={
                  !isCollapsed && (
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0" />
                  )
                }
                variant="light"
                onPress={handleSignOut}
              >
                {isCollapsed ? (
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                ) : (
                  <span className="truncate text-sm">Logout</span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-auto transition-all duration-300">
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
