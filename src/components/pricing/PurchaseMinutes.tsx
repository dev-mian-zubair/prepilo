import { useState } from "react";
import { Card, CardBody, Button, Input } from "@heroui/react";

const minutePacks = [
  { minutes: 100, price: 9.99 },
  { minutes: 500, price: 39.99 },
  { minutes: 1000, price: 69.99 }
];

export default function PurchaseMinutes() {
  const [customMinutes, setCustomMinutes] = useState("");

  const calculatePrice = (minutes: number) => {
    return (minutes * 0.1).toFixed(2); // $0.10 per minute
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {minutePacks.map((pack) => (
          <Card key={pack.minutes} className="bg-background border border-divider">
            <CardBody className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{pack.minutes} minutes</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">${pack.price}</span>
                </div>
                <p className="text-default-500">
                  ${(pack.price / pack.minutes).toFixed(2)} per minute
                </p>
              </div>

              <Button 
                color="primary" 
                className="w-full"
                onPress={() => {/* Handle purchase */}}
              >
                Purchase
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="bg-background border border-divider">
        <CardBody className="space-y-3">
          <h3 className="text-lg font-semibold">Custom Amount</h3>
          <div className="flex gap-4">
            <Input
              type="number"
              label="Minutes"
              placeholder="Enter minutes"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              min={1}
            />
            <div className="flex flex-col justify-end">
              <p className="text-default-500">
                Price: ${calculatePrice(Number(customMinutes) || 0)}
              </p>
            </div>
          </div>
          <Button 
            color="primary" 
            className="w-full"
            isDisabled={!customMinutes}
            onPress={() => {/* Handle purchase */}}
          >
            Purchase Custom Amount
          </Button>
        </CardBody>
      </Card>
    </div>
  );
} 