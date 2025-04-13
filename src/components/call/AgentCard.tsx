import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import React from "react";
import { Chip } from "@heroui/chip";

import { CallStatus } from "../interview/generate/GenerateInterviewByAgent";

const AgentCard = ({
  isSpeaking,
  status,
}: {
  isSpeaking: boolean;
  status: CallStatus;
}) => {
  const chipInfo = {
    ACTIVE: ["success", "Active"],
    INACTIVE: ["danger", "Inactive"],
    CONNECTING: ["warning", "Connecting..."],
    FINISHED: ["default", "Inactive"],
  }[status];

  return (
    <div className="absolute top-10 left-10 z-30">
      <Card className="relative overflow-hidden rounded-medium border-none shadow-md w-72">
        <div className="absolute inset-0 bg-gradient-to-t z-10" />
        <CardBody className="flex flex-col items-center justify-center p-4 z-20 relative h-38">
          <Chip
            className="absolute top-2 left-2"
            color={chipInfo[0] as any}
            size="sm"
          >
            {chipInfo[1]}
          </Chip>
          <div
            className={`rounded-full p-4 ${
              isSpeaking ? "animate-pulse bg-green-200" : ""
            }`}
          >
            <Avatar
              className={`w-12 h-12 border-2 rounded-full ${
                isSpeaking ? "border-green-500" : "border-transparent"
              }`}
              radius="full"
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
            />
          </div>
          <span className="mt-2 text-xs font-medium">Sam (AI)</span>
        </CardBody>
      </Card>
    </div>
  );
};

export default AgentCard;
