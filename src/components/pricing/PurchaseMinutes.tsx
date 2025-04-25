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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {minutePacks.map((pack) => (
        <Card key={pack.minutes} className="bg-background border border-divider shadow-none">
          <CardBody className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold">{pack.minutes} minutes</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold">${pack.price}</span>
              </div>
              <p className="text-default-500 text-sm">
                ${(pack.price / pack.minutes).toFixed(2)} per minute
              </p>
            </div>
            <Button color="primary" className="w-full text-sm" onPress={() => {/* Handle purchase */}}>
              Purchase
            </Button>
          </CardBody>
        </Card>
      ))}

      <Card className="bg-background border border-divider">
        <CardBody className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Custom Amount</h3>
            <p className="text-default-500 text-sm">
              Price: ${calculatePrice(Number(customMinutes) || 0)}
            </p>
          </div>
          <Input
            type="number"
            placeholder="Enter minutes"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            min={1}
            classNames={{
              input: "text-sm"
            }}
          />
          <Button 
            color="primary" 
            className="w-full text-sm"
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