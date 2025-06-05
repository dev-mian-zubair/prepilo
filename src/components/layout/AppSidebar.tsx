"use client";
import { Link } from "@heroui/link";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { APP_CONFIG } from "@/config/app";
import { cn } from "@/lib/utils";
import { handleSignOut } from "@/helpers/auth.helper";

interface AppSidebarProps {
  isActive: (path: string) => boolean;
}

export function AppSidebar({ isActive }: AppSidebarProps) {
  return (
    <aside className="hidden md:block bg-background-secondary p-6 w-72">
      <div className="flex flex-col h-full">
        <nav className="flex-1 space-y-2">
          {APP_CONFIG.navigation.main.map(({ icon: Icon, label, href }) => (
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
  );
} 