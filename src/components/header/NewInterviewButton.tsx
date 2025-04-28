"use client";
import React from "react";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { PlusIcon } from "lucide-react";

import InterviewGeneratorModal from "../modals/InterviewGeneratorModal";

const NewInterviewButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        className="font-semibold"
        color="primary"
        radius="lg"
        size="md"
        variant="solid"
        onPress={onOpen}
      >
        <PlusIcon />
        Create
      </Button>
      <InterviewGeneratorModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default NewInterviewButton;
