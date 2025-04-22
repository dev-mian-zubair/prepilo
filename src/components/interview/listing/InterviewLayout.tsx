import { Card, CardBody, CardHeader } from "@heroui/card";

interface InterviewLayoutProps {
  children: React.ReactNode;
}

export default function InterviewLayout({ children }: InterviewLayoutProps) {
  return (
    <div className="min-h-screen">
      <div>
        {children}
      </div>
    </div>
  );
} 