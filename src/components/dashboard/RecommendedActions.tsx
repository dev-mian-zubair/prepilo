import { Card, CardBody, CardHeader } from "@heroui/card";

interface RecommendedAction {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export default function RecommendedActions() {
  const actions: RecommendedAction[] = [
    {
      title: "Practice System Design",
      description: "Your score is 15% below average in system design interviews",
      priority: "high" as const,
    },
    {
      title: "Try Advanced React",
      description: "You've mastered Intermediate React concepts",
      priority: "medium" as const,
    },
    {
      title: "Review Database Concepts",
      description: "Strengthen your understanding of database optimization",
      priority: "medium" as const,
    },
    {
      title: "Explore Cloud Architecture",
      description: "Improve your knowledge of cloud services and patterns",
      priority: "high" as const,
    },
    {
      title: "Practice Data Structures",
      description: "Focus on advanced data structure implementations",
      priority: "medium" as const,
    },
    {
      title: "Learn GraphQL",
      description: "Add modern API development to your skillset",
      priority: "low" as const,
    }
  ];

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'from-rose-500/20 to-rose-400/20 dark:from-rose-400/20 dark:to-rose-300/20',
          text: 'text-rose-700 dark:text-rose-300',
          hover: 'hover:from-rose-500/30 hover:to-rose-400/30'
        };
      case 'medium':
        return {
          bg: 'from-amber-500/20 to-amber-400/20 dark:from-amber-400/20 dark:to-amber-300/20',
          text: 'text-amber-700 dark:text-amber-300',
          hover: 'hover:from-amber-500/30 hover:to-amber-400/30'
        };
      default:
        return {
          bg: 'from-emerald-500/20 to-emerald-400/20 dark:from-emerald-400/20 dark:to-emerald-300/20',
          text: 'text-emerald-700 dark:text-emerald-300',
          hover: 'hover:from-emerald-500/30 hover:to-emerald-400/30'
        };
    }
  };

  return (
    <Card className="bg-content1 rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader>
        <h2 className="text-large font-bold text-foreground tracking-tight">Recommended Actions</h2>
      </CardHeader>
      <CardBody>
        <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-default-100 scrollbar-thumb-default-300 hover:scrollbar-thumb-default-400">
          <div className="space-y-3">
            {actions.map((action, index) => {
              const colors = getPriorityColors(action.priority);
              
              return (
                <div 
                  key={index} 
                  className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">{action.title}</h3>
                    <div className={`px-3 py-1 rounded-small bg-gradient-to-r ${colors.bg} ${colors.text} text-tiny font-medium transition-all duration-300 ${colors.hover}`}>
                      {action.priority} priority
                    </div>
                  </div>
                  <p className="text-tiny text-foreground/70">{action.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 