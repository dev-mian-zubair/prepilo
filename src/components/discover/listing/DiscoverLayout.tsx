import { Card, CardBody, CardHeader } from "@heroui/card";

interface DiscoverLayoutProps {
  children: React.ReactNode;
}

export default function DiscoverLayout({ children }: DiscoverLayoutProps) {
  return (
    <div className="min-h-screen">
      <div>
        {children}
      </div>
    </div>
  );
} 