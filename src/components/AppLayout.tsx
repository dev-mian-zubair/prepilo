"use client";
import { useState } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { usePathname } from "next/navigation";
import HeaderRightActions from "./header/HeaderRightActions";
import { useAuth } from "@/providers/AuthProvider";
import { 
  Bars3Icon,
  HomeIcon,
  VideoCameraIcon, 
  UserIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", href: "/app/dashboard" },
    { icon: VideoCameraIcon, label: "Interviews", href: "/app/interviews" },
    { icon: MagnifyingGlassIcon, label: "Discover", href: "/app/discover" },
    { icon: UserIcon, label: "Profile", href: "/app/profile" },
    { icon: ChartBarIcon, label: "Analytics", href: "/app/analytics" },
    { icon: Cog6ToothIcon, label: "Settings", href: "/app/settings" },
  ];

  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const buttonStyles = cn(
    "w-full h-10 transition-all duration-200 whitespace-nowrap text-left",
    !isCollapsed && "justify-start"
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <HeroUINavbar 
        className="bg-background border-b [&>header]:px-3" 
        maxWidth="full" 
        position="sticky"
      >
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit mr-4">
            <Button
              isIconOnly
              variant="light"
              className="mr-2"
              onClick={handleSidebarToggle}
            >
              <Bars3Icon className="w-5 h-5" />
            </Button>
            <Link className="flex justify-start items-center gap-1" href="/app">
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-foreground">Prep</span>ilo
              </h1>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
          <NavbarItem className="flex gap-2 items-center">
            <HeaderRightActions />
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
          "bg-background border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}>
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-2">
              {menuItems.map(({ icon: Icon, label, href }) => (
                <Link key={href} href={href} className="block" onClick={(e) => e.stopPropagation()}>
                  <Button
                    isIconOnly={isCollapsed}
                    variant="light"
                    className={buttonStyles}
                    startContent={!isCollapsed && <Icon className="w-5 h-5 shrink-0" />}
                  >
                    {isCollapsed ? <Icon className="w-5 h-5" /> : <span className="truncate">{label}</span>}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Logout */}
            <div className="border-t p-2">
              <Button
                isIconOnly={isCollapsed}
                variant="light"
                color="danger"
                className={buttonStyles}
                startContent={!isCollapsed && <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0" />}
                onClick={(e) => e.stopPropagation()}
              >
                {isCollapsed ? <ArrowLeftOnRectangleIcon className="w-5 h-5" /> : <span className="truncate">Logout</span>}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-auto transition-all duration-300">
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 