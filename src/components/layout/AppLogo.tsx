"use client";
import { Link } from "@heroui/link";
import { APP_CONFIG } from "@/config/app";

interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className }: AppLogoProps) {
  return (
    <Link 
      href="/app" 
      className={`flex items-center gap-2.5 group transition-all duration-200 hover:opacity-90 ${className}`}
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
  );
} 