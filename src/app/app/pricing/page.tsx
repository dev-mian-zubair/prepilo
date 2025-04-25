"use client";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import PurchaseMinutes from "@/components/pricing/PurchaseMinutes";
import PaymentHistory from "@/components/pricing/PaymentHistory";

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">Subscription & Billing</h1>
        <p className="text-default-500 text-sm">
          Manage your subscription, purchase minutes, and view payment history
        </p>
      </div>

      <Tabs aria-label="Subscription options">
        <Tab key="purchase" title="Purchase Minutes">
          <Card className="bg-transparent border-none shadow-none">
            <CardBody>
              <PurchaseMinutes />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="history" title="Payment History">
          <Card className="bg-transparent border-none shadow-none">
            <CardBody>
              <PaymentHistory />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
} 