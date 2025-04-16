"use client";

import NavigationBar from "./_components/NavigationBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full bg-background rounded-xl shadow-none overflow-hidden">
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-content1 rounded-b-xl">
        {children}
      </div>
    </div>
  );
}
