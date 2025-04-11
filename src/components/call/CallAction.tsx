import { Button } from "@heroui/button";
import React from "react";

interface CallActionProps {
  isCameraOn: boolean;
  handleLeaveCall: () => void;
  toggleCamera: () => void;
}

const CallAction = ({
  isCameraOn,
  handleLeaveCall,
  toggleCamera,
}: CallActionProps) => {
  return (
    <div className="p-4 flex justify-center gap-6 bg-content1 border-t border-divider h-20">
      <Button
        color="danger"
        radius="full"
        size="md"
        variant="solid"
        onPress={handleLeaveCall}
      >
        Leave Call
      </Button>
      <Button
        color={!isCameraOn ? "primary" : "default"}
        radius="full"
        size="md"
        variant="solid"
        onPress={toggleCamera}
      >
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </Button>
    </div>
  );
};

export default CallAction;
