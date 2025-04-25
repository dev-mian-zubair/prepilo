import { useState } from "react";
import { cn } from "@/lib/utils";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import SubscriptionWarningModal from "./SubscriptionWarningModal";

interface Subscription {
  used: number;
  total: number;
}

export default function SubscriptionMinutes({ 
  subscription,
  className 
}: { 
  subscription: Subscription;
  className?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { used, total } = subscription;
  const percentage = (used / total) * 100;
  const isLow = percentage > 80;

  return (
    <>
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-medium",
        isLow ? "bg-danger-100/50" : "bg-default-100/50",
        className
      )}>
        <span className={cn(
          "text-sm font-medium",
          isLow ? "text-danger" : "text-foreground"
        )}>
          {used}
        </span>
        <span className="text-sm text-default-500">/</span>
        <span className="text-sm text-default-500">{total}</span>
        <span className="text-sm text-default-500">min</span>
        {isLow && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="ml-1 text-warning hover:text-warning-600 transition-colors"
          >
            <InformationCircleIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      <SubscriptionWarningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        used={used}
        total={total}
      />
    </>
  );
} 