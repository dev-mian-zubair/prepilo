"use client";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import Webcam from "react-webcam";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface UserVideoAreaProps {
  isVideoOff: boolean;
}

const colorPalette = [
  "from-blue-200 to-indigo-300",
  "from-green-200 to-teal-300",
  "from-purple-200 to-pink-300",
  "from-red-200 to-orange-300",
  "from-cyan-200 to-blue-300",
  "from-yellow-200 to-green-300",
];

const avatarBorderColors = [
  "border-blue-500",
  "border-green-500",
  "border-purple-500",
  "border-red-500",
  "border-teal-500",
  "border-pink-500",
];

const UserVideoArea = ({ isVideoOff }: UserVideoAreaProps) => {
  const randomGradient = useMemo(() => {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)];
  }, [isVideoOff]);

  const randomBorderColor = useMemo(() => {
    return avatarBorderColors[
      Math.floor(Math.random() * avatarBorderColors.length)
    ];
  }, [isVideoOff]);

  return (
    <Card className="absolute inset-0 rounded-none border-none shadow-none transition-all duration-300">
      <CardBody
        className={cn(
          "flex flex-col items-center justify-center p-8 z-20 relative max-h-[800px]",
          isVideoOff
            ? `m-8 rounded-xl shadow-sm bg-gradient-to-tl ${randomGradient} w-[calc(100%-440px)] mr-[440px] max-h-[735px]`
            : "",
        )}
      >
        {!isVideoOff ? (
          <Webcam
            audio={false}
            className="h-full object-cover rounded-lg shadow-none w-[calc(100%-380px)] mr-[380px]"
            videoConstraints={{ facingMode: "user" }}
          />
        ) : (
          <div className="flex flex-col items-center">
            <Avatar
              className={`w-40 h-40 border-4 ${randomBorderColor}`}
              radius="full"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default UserVideoArea;
