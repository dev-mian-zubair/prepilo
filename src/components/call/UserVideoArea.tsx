"use client";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import Webcam from "react-webcam";

import { cn } from "@/lib/utils";

interface UserVideoAreaProps {
  isVideoOff: boolean;
}

const UserVideoArea = ({ isVideoOff }: UserVideoAreaProps) => {
  return (
    <Card className="absolute inset-0 rounded-none border-none shadow-none transition-all duration-300">
      <CardBody
        className={cn(
          "flex flex-col items-center justify-center p-8 z-20 relative max-h-[800px]",
          isVideoOff
            ? "m-8 rounded-xl shadow-sm bg-gradient-to-tl from-blue-400 to-gray-300 w-[calc(100%-440px)] mr-[440px] max-h-[735px]"
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
              className="w-40 h-40 border-4"
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
