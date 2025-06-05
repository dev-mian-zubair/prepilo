import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface SubscriptionWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  used: number;
  total: number;
}

export default function SubscriptionWarningModal({ 
  isOpen, 
  onClose,
  used,
  total 
}: SubscriptionWarningModalProps) {
  const router = useRouter();
  const remaining = total - used;
  
  const handleBuyMore = () => {
    onClose();
    router.push('/app/pricing');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <InformationCircleIcon className="w-6 h-6 text-warning" />
            <span>Low Minutes Warning</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-default-600">
              You have only {remaining} minutes remaining in your subscription. 
              This might interrupt your ongoing interviews.
            </p>
            <p className="text-default-600">
              Please consider purchasing more minutes to continue uninterrupted interviews.
            </p>
            <div className="flex justify-end">
              <Button color="primary" onPress={handleBuyMore}>
                Buy More Minutes
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 