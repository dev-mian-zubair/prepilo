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

import { handleSignOut } from "@/helpers/auth.helper";

const UserDropdown = ({ user }: { user: any }) => {
  const iconClasses = "w-5 h-5";

  return (
    <Dropdown className="shadow-lg rounded-xl" placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          className="cursor-pointer border border-gray-200"
          color="primary"
          size="lg"
          src={user?.user_metadata?.avatar_url || "/default-avatar.png"}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="shadow" className="w-64">
        <DropdownItem
          key="app"
          className="p-2 rounded-xl"
          href="/app"
          startContent={<ChartPie className={iconClasses}/>}
        >
          Dashboard
        </DropdownItem>
        <DropdownItem
          key="progress"
          className="p-2 rounded-xl"
          href="/settings"
          startContent={<Settings className={iconClasses} />}
        >
          Settings
        </DropdownItem>
        <DropdownItem
          key="helpAndFeedback"
          className="p-2 rounded-xl"
          href="/help"
          startContent={<CircleHelp className={iconClasses} />}
        >
          Help & Feedback
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="p-2 rounded-xl"
          startContent={<LogOut className={iconClasses} />}
          onPress={handleSignOut}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserDropdown;
