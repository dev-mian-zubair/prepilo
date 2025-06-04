import { useState } from "react";
import { cn } from "@/lib/utils";
import { InformationCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
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
  const isCritical = percentage > 90;

  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-lg border h-11 items-center justify-center px-2 cursor-pointer",
          isCritical ? "border-danger/50 bg-danger/5" : 
          isLow ? "border-warning/50 bg-warning/5" : 
          "border-default-200/50 bg-default-100/50",
          className
        )}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Minutes counter */}
        <div className="flex items-center justify-between text-sm">
          <span className={cn(
            "font-medium",
            isCritical ? "text-danger" :
            isLow ? "text-warning" :
            "text-default-700"
          )}>
            {used} minutes used
          </span>
          <span className="text-default-500">
            &nbsp;{total - used} remaining
          </span>
        </div>
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