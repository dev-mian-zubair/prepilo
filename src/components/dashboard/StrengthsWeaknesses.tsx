import { Card, CardBody, CardHeader } from "@heroui/card";
import { UserStrength, UserWeakness } from "@/types/dashboard";

interface StrengthsWeaknessesProps {
  strengths: UserStrength[];
  weaknesses: UserWeakness[];
}

export default function StrengthsWeaknesses({ strengths, weaknesses }: StrengthsWeaknessesProps) {
  return (
    <Card className="bg-content1 shadow-lg">
      <CardHeader className="bg-default-100 border-b border-default-200">
        <h2 className="text-xl font-semibold text-foreground">Strengths & Weaknesses</h2>
      </CardHeader>
      <CardBody className="text-foreground">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-success mb-3">Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {strengths.map((strength, index) => (
                <div
                  key={index}
                  className="px-3 py-1 rounded-full bg-success/20 text-success-500 text-sm font-medium hover:bg-success/30 transition-colors"
                >
                  {strength.category}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-danger mb-3">Areas for Improvement</h3>
            <div className="flex flex-wrap gap-2">
              {weaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="px-3 py-1 rounded-full bg-danger/20 text-danger-500 text-sm font-medium hover:bg-danger/30 transition-colors"
                >
                  {weakness.category}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 