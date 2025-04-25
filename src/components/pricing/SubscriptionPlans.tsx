import { Card, CardBody, Button } from "@heroui/react";

const plans = [
  {
    name: "Free Tier",
    price: "Free",
    minutes: 30,
    features: [
      "30 minutes per month",
      "Basic interview features",
      "Email support"
    ]
  },
  {
    name: "Starter",
    price: "$9.99",
    minutes: 100,
    features: [
      "100 minutes per month",
      "All interview features",
      "Priority support",
      "Analytics dashboard"
    ]
  },
  {
    name: "Professional",
    price: "$29.99",
    minutes: 500,
    features: [
      "500 minutes per month",
      "All interview features",
      "24/7 support",
      "Advanced analytics",
      "Custom branding"
    ]
  }
];

export default function SubscriptionPlans() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.name} className="bg-background border border-divider">
          <CardBody className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-default-500">/month</span>
              </div>
              <p className="text-default-500">{plan.minutes} minutes included</p>
            </div>

            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              color="primary" 
              className="w-full"
              onPress={() => {/* Handle subscription */}}
            >
              Subscribe
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
} 