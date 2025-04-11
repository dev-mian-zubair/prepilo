"use client";
import React, { useState } from "react";
import { Button, ButtonGroup } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { ChevronDownIcon } from "lucide-react";

import InterviewGeneratorModal from "../modals/InterviewGeneratorModal";

export enum InterviewType {
  manually = "manually",
  agent = "agent",
}

const NewInterviewButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedOption, setSelectedOption] = useState<InterviewType>(
    InterviewType.agent,
  );
  const descriptionsMap: Record<InterviewType, string> = {
    manually: "Create an interview manually by adding job description.",
    agent: "Create an interview with an agent by questions and answers.",
  };
  const labelsMap: Record<InterviewType, string> = {
    manually: "Create Interview Manually",
    agent: "Create Interview with Agent",
  };

  return (
    <>
      <ButtonGroup
        className="rounded-full"
        radius="full"
        size="sm"
        variant="bordered"
      >
        <Button onPress={onOpen}>{labelsMap[selectedOption]}</Button>
        <Dropdown className="shadow-sm" placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly variant="bordered">
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="New Interview Options"
            selectedKeys={selectedOption as InterviewType}
            selectionMode="single"
            onSelectionChange={(selected) => {
              setSelectedOption(selected.currentKey as InterviewType);
            }}
          >
            {Object.values(InterviewType).map((option) => (
              <DropdownItem key={option} description={descriptionsMap[option]}>
                {labelsMap[option]}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </ButtonGroup>
      {isOpen && (
        <InterviewGeneratorModal
          isOpen={isOpen}
          type={selectedOption}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default NewInterviewButton;
