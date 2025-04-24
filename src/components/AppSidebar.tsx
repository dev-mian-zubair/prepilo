"use client";
import Link from "next/link";
import { Button } from "@heroui/button";
import { 
  HomeIcon,
  VideoCameraIcon, 
  UserIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

export function AppSidebar() {
  const { isCollapsed } = useSidebar();
  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", href: "/app/dashboard" },
    { icon: VideoCameraIcon, label: "Interviews", href: "/app/interviews" },
    { icon: MagnifyingGlassIcon, label: "Discover", href: "/app/discover" },
    { icon: UserIcon, label: "Profile", href: "/app/profile" },
    { icon: ChartBarIcon, label: "Analytics", href: "/app/analytics" },
    { icon: Cog6ToothIcon, label: "Settings", href: "/app/settings" },
  ];

  return (
    <div className={cn(
      "bg-background border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className={cn(
          "flex-1 space-y-2 p-2",
        )}>
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
            >
              <Button
                isIconOnly={isCollapsed}
                variant="light"
                className={cn(
                  "w-full transition-all duration-200",
                  !isCollapsed && "justify-start"
                )}
                startContent={!isCollapsed && <item.icon className="w-5 h-5" />}
              >
                {isCollapsed ? (
                  <item.icon className="w-5 h-5" />
                ) : (
                  item.label
                )}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className={cn(
          "border-t p-2",
        )}>
          <Button
            isIconOnly={isCollapsed}
            variant="light"
            color="danger"
            className={cn(
              "w-full transition-all duration-200",
              !isCollapsed && "justify-start"
            )}
            startContent={!isCollapsed && <ArrowLeftOnRectangleIcon className="w-5 h-5" />}
          >
            {isCollapsed ? (
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            ) : (
              "Logout"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 