import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Providers } from "@/providers";
import { fontSans } from "@/config/fonts";
import { PortalSidebar } from "@/components/PortalSidebar";

export const metadata: Metadata = {
  title: "Portal - Prepilo",
  description: "Your interview preparation portal",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <PortalSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 