"use client";
import { Link } from "@heroui/link";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { APP_CONFIG } from "@/config/app";
import { cn } from "@/lib/utils";
import { handleSignOut } from "@/helpers/auth.helper";
import HeaderRightActions from "../header/HeaderRightActions";

interface MobileMenuProps {
  isOpen: boolean;
  isActive: (path: string) => boolean;
}

export function MobileMenu({ isOpen, isActive }: MobileMenuProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-30 bg-background/80 backdrop-blur-md transition-opacity md:hidden",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-xs bg-content1 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {APP_CONFIG.navigation.main.map(({ icon: Icon, label, href }) => (
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
  );
} 