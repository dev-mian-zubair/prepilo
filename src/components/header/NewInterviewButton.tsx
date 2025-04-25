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
        className="rounded-md"
        color="primary"
        radius="md"
        size="sm"
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
