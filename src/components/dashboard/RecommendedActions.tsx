import { Card, CardBody, CardHeader } from "@heroui/card";

interface RecommendedAction {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendedActionsProps {
  actions: RecommendedAction[];
}

export default function RecommendedActions({ actions }: RecommendedActionsProps) {
  return (
    <Card className="bg-content1 shadow-lg">
      <CardHeader className="bg-default-100 border-b border-default-200">
        <h2 className="text-xl font-semibold text-foreground">Recommended Actions</h2>
      </CardHeader>
      <CardBody className="text-foreground">
        <div className="space-y-4">
          {actions.map((action, index) => (
            <div 
              key={index} 
              className="p-4 border border-content2 rounded-lg space-y-2 bg-content2/40 hover:bg-content2/60 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">{action.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  action.priority === 'high' ? 'bg-danger/20 text-danger-500' :
                  action.priority === 'medium' ? 'bg-warning/20 text-warning-500' :
                  'bg-success/20 text-success-500'
                }`}>
                  {action.priority} priority
                </span>
              </div>
              <p className="text-sm text-foreground/70">{action.description}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
} 