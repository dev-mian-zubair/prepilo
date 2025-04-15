import { Card, CardBody, CardHeader } from "@heroui/card";
import { UserStrength, UserWeakness } from "@/types/dashboard";

interface StrengthsWeaknessesProps {
  strengths: UserStrength[];
  weaknesses: UserWeakness[];
}

export default function StrengthsWeaknesses({ strengths, weaknesses }: StrengthsWeaknessesProps) {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="bg-green-50">
        <h2 className="text-xl font-semibold text-green-800">Strengths & Weaknesses</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-green-700 mb-3">Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {strengths.map((strength, index) => (
                <div
                  key={index}
                  className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium"
                >
                  {strength.category}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-red-700 mb-3">Areas for Improvement</h3>
            <div className="flex flex-wrap gap-2">
              {weaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium"
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