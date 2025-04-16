import { Card, CardBody, CardHeader } from "@heroui/card";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="p-6">
      <div className="grid gap-6">
        {children}
      </div>
    </div>
  );
} 