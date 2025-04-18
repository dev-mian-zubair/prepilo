import { Card, CardBody, CardHeader } from "@heroui/card";

interface InterviewLayoutProps {
  children: React.ReactNode;
}

export default function InterviewLayout({ children }: InterviewLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {children}
      </div>
    </div>
  );
} 