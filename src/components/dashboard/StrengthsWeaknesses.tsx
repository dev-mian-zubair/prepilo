import { Card, CardBody, CardHeader } from "@heroui/card";
import { UserStrength, UserWeakness } from "@/types/dashboard";

export default function StrengthsWeaknesses() {
  const strengths: UserStrength[] = [
    {
      category: "React Hooks",
      description: "Strong understanding of useEffect and useState",
      sessionIds: ["1", "2"],
    },
    {
      category: "TypeScript",
      description: "Excellent type system knowledge",
      sessionIds: ["3"],
    },
    {
      category: "API Design",
      description: "RESTful principles and best practices",
      sessionIds: ["4"],
    }
  ];

  const weaknesses: UserWeakness[] = [
    {
      category: "System Design",
      description: "Need to improve scalability discussions",
      improvementTips: ["Study common patterns", "Practice whiteboarding"],
    },
    {
      category: "Database Optimization",
      description: "Query performance needs improvement",
      improvementTips: ["Learn indexing strategies", "Study query plans"],
    },
    {
      category: "Security Practices",
      description: "Authentication workflows need work",
      improvementTips: ["Review OAuth flows", "Study JWT best practices"],
    }
  ];

  return (
    <Card className="bg-content1 rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader>
        <h2 className="text-large font-bold text-foreground tracking-tight">Strengths & Weaknesses</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {/* Strengths Section */}
          <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
            <h3 className="text-medium font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
              Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {strengths.map((strength, index) => (
                <div
                  key={index}
                  className="group/item relative"
                >
                  <div className="px-3 py-1.5 rounded-medium bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 dark:from-emerald-400/20 dark:to-emerald-300/20 text-emerald-700 dark:text-emerald-300 text-tiny font-medium hover:from-emerald-500/30 hover:to-emerald-400/30 transition-all duration-300">
                    {strength.category}
                  </div>
                  {strength.description && (
                    <div className="absolute z-50 hidden group-hover/item:block bottom-full left-0 mb-2 w-48 p-2 bg-content2 rounded-medium border border-border shadow-lg">
                      <p className="text-tiny text-foreground/90">{strength.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses Section */}
          <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
            <h3 className="text-medium font-semibold text-rose-600 dark:text-rose-400 mb-3">
              Areas for Improvement
            </h3>
            <div className="flex flex-wrap gap-2">
              {weaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="group/item relative"
                >
                  <div className="px-3 py-1.5 rounded-medium bg-gradient-to-r from-rose-500/20 to-rose-400/20 dark:from-rose-400/20 dark:to-rose-300/20 text-rose-700 dark:text-rose-300 text-tiny font-medium hover:from-rose-500/30 hover:to-rose-400/30 transition-all duration-300">
                    {weakness.category}
                  </div>
                  {(weakness.description || weakness.improvementTips) && (
                    <div className="absolute z-50 hidden group-hover/item:block bottom-full left-0 mb-2 w-48 p-2 bg-content2 rounded-medium border border-border shadow-lg">
                      {weakness.description && (
                        <p className="text-tiny text-foreground/90 mb-1">{weakness.description}</p>
                      )}
                      {weakness.improvementTips && weakness.improvementTips.length > 0 && (
                        <ul className="list-disc list-inside">
                          {weakness.improvementTips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-tiny text-foreground/70">{tip}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 