"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { ChartPie, Settings, CircleHelp, LogOut } from "lucide-react";

const UserDropdown = ({ user }: { user: any }) => {
  const iconClasses = "w-4 h-4";

  return (
    <Dropdown className="shadow-lg rounded-lg" placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          className="cursor-pointer border border-gray-200"
          color="primary"
          size="md"
          src={user?.user_metadata?.avatar_url || "/default-avatar.png"}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem
          key="portal"
          className="p-2"
          href="/portal"
          startContent={<ChartPie className={iconClasses} />}
        >
          <span>Portal</span>
        </DropdownItem>
        <DropdownItem
          key="progress"
          className="p-2"
          href="/settings"
          startContent={<Settings className={iconClasses} />}
        >
          <span>Settings</span>
        </DropdownItem>
        <DropdownItem
          key="helpAndFeedback"
          className="p-2"
          href="/help"
          startContent={<CircleHelp className={iconClasses} />}
        >
          <span>Help & Feedback</span>
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="p-2 text-danger"
          href="/logout"
          startContent={<LogOut className={iconClasses} />}
        >
          <span>Log Out</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserDropdown;
