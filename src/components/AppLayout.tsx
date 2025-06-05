"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "./layout/AppHeader";
import { MobileMenu } from "./layout/MobileMenu";
import { AppSidebar } from "./layout/AppSidebar";

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

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader 
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        isActive={isActive}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar isActive={isActive} />
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
