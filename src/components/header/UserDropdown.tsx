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
    <Dropdown className="shadow-sm" placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          className="cursor-pointer"
          color="primary"
          size="sm"
          src={user.user_metadata.avatar_url}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem
          key="dashboard"
          className="p-2"
          href="/dashboard"
          startContent={<ChartPie className={iconClasses} />}
        >
          <span>Dashboard</span>
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
          className="p-2"
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
