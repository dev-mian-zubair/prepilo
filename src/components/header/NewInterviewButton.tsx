"use client";
import React from "react";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { Plus } from "lucide-react";

import InterviewGeneratorModal from "../modals/InterviewGeneratorModal";

const NewInterviewButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        color="primary"
        size="lg"
        radius="lg"
        startContent={<Plus className="w-4 h-4" />}
        onPress={onOpen}
      >
        Create Interview
      </Button>
      <InterviewGeneratorModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default NewInterviewButton;
