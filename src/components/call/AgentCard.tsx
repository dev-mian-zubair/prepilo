import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import React, { useMemo } from "react";
import { Chip } from "@heroui/chip";

import { CallStatus } from "@/enums";

const colorPalette = [
  "from-blue-200 to-indigo-300",
  "from-green-200 to-teal-300",
  "from-purple-200 to-pink-300",
  "from-red-200 to-orange-300",
  "from-cyan-200 to-blue-300",
  "from-yellow-200 to-green-300",
];

const speakingBorderColors = [
  "border-blue-500",
  "border-green-500",
  "border-purple-500",
  "border-red-500",
  "border-teal-500",
  "border-pink-500",
];

const speakingPulseColors = [
  "bg-blue-300",
  "bg-green-300",
  "bg-purple-300",
  "bg-red-300",
  "bg-teal-300",
  "bg-pink-300",
];

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

  const randomGradient = useMemo(() => {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)];
  }, []);

  const randomSpeakingColors = useMemo(() => {
    const borderColor =
      speakingBorderColors[
        Math.floor(Math.random() * speakingBorderColors.length)
      ];
    const pulseColor =
      speakingPulseColors[
        Math.floor(Math.random() * speakingPulseColors.length)
      ];

    return { borderColor, pulseColor };
  }, [isSpeaking]);

  return (
    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 w-60 sm:w-72">
      <Card
        className={`relative overflow-hidden rounded-lg border-none shadow-md bg-gradient-to-tl ${randomGradient}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t z-10" />
        <CardBody className="flex flex-col items-center justify-center p-3 sm:p-4 z-20 relative h-32 sm:h-38">
          <Chip
            className="absolute top-1 left-1 text-white text-xs"
            color={chipInfo[0] as any}
            size="sm"
          >
            {chipInfo[1]}
          </Chip>
          <div
            className={`rounded-full p-3 sm:p-4 ${
              isSpeaking
                ? `animate-pulse ${randomSpeakingColors.pulseColor}`
                : ""
            }`}
          >
            <Avatar
              className={`w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-full ${
                isSpeaking
                  ? randomSpeakingColors.borderColor
                  : "border-transparent"
              }`}
              radius="full"
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
            />
          </div>
          <span className="text-xs font-medium absolute bottom-1 left-1 text-black/80">
            Hana
          </span>
        </CardBody>
      </Card>
    </div>
  );
};

export default AgentCard;
