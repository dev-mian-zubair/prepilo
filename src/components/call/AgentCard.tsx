import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import React from "react";

const AgentCard = () => {
  return (
    <div className="absolute top-10 left-10 z-30">
      <Card className="relative overflow-hidden rounded-medium border-none shadow-md w-52">
        <div className="absolute inset-0 bg-gradient-to-t z-10" />
        <CardBody className="flex flex-col items-center justify-center p-4 z-20 relative h-32">
          <Avatar
            className="w-12 h-12 border-2"
            radius="full"
            src="https://i.pravatar.cc/150?u=a04258114e29026708c"
          />
          <span className="mt-2 text-xs font-medium">Sam (AI)</span>
        </CardBody>
      </Card>
    </div>
  );
};

export default AgentCard;
