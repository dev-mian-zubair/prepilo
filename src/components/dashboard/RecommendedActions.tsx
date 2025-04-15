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
    <Card className="bg-white shadow-lg">
      <CardHeader className="bg-orange-50">
        <h2 className="text-xl font-semibold text-orange-800">Recommended Actions</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {actions.map((action, index) => (
            <div key={index} className="p-4 border border-orange-100 rounded-lg space-y-2 bg-orange-50/50">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-orange-900">{action.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  action.priority === 'high' ? 'bg-red-100 text-red-800' :
                  action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {action.priority} priority
                </span>
              </div>
              <p className="text-sm text-orange-600">{action.description}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
} 