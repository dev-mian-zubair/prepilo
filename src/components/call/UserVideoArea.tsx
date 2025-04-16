"use client";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import Webcam from "react-webcam";

import { cn } from "@/lib/utils";

interface UserVideoAreaProps {
  isCameraOn: boolean;
}

const UserVideoArea = ({ isCameraOn }: UserVideoAreaProps) => {
  return (
    <Card className="absolute inset-0 rounded-none border-none shadow-none transition-all duration-300">
      <div className="absolute inset-0 z-10" />
      <CardBody
        className={cn(
          "flex flex-col items-center justify-center p-8 z-20 relative max-h-[800px]",
          !isCameraOn
            ? "m-8 rounded-xl shadow-sm bg-gradient-to-tl from-blue-50 to-gray-50 w-[calc(100%-65px)] max-h-[740px]"
            : "",
        )}
      >
        {isCameraOn ? (
          <Webcam
            audio={false}
            className="w-full h-full object-cover rounded-lg shadow-none"
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
