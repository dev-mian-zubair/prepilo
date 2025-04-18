"use client";
import React from "react";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { Link } from "@heroui/link";
import { PlusIcon } from "lucide-react";

export enum InterviewType {
  manually = "manually",
  agent = "agent",
}

const NewInterviewButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Button
      as={Link}
      className="font-semibold"
      color="primary"
      href="/interviews"
      radius="full"
      size="md"
      variant="solid"
    >
      <PlusIcon />
      Create
    </Button>
  );
};

export default NewInterviewButton;
