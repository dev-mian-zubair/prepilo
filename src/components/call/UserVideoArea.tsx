import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import Webcam from "react-webcam";

interface UserVideoAreaProps {
  isCameraOn: boolean;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserVideoArea = ({ isCameraOn, setIsCameraOn }: UserVideoAreaProps) => {
  return (
    <Card className="absolute inset-0 rounded-none border-none shadow-none transition">
      <div className="absolute inset-0 z-10" />
      <CardBody className="flex flex-col items-center justify-center p-8 z-20 relative h-full bg-default-50">
        {isCameraOn ? (
          <Webcam
            audio={false}
            className="w-full h-full object-cover rounded-lg shadow-none"
            videoConstraints={{ facingMode: "user" }}
            onUserMedia={() => setIsCameraOn(true)}
            onUserMediaError={() => setIsCameraOn(false)}
          />
        ) : (
          <div className="flex flex-col items-center">
            <Avatar
              className="w-40 h-40 border-4"
              radius="full"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
            <span className="mt-6 text-lg font-medium">You</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default UserVideoArea;
