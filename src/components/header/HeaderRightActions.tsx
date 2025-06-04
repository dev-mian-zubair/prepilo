"use client";
import React from "react";

import { ThemeSwitch } from "../ThemeSwitch";

import UserDropdown from "./UserDropdown";
import SignInButton from "./SignInButton";
import NewInterviewButton from "./NewInterviewButton";

import { useAuth } from "@/providers/AuthProvider";

const HeaderRightActions = () => {
  const { user, loading } = useAuth();

  return (
    <div className="flex items-center gap-3">
      {/* <ThemeSwitch /> */}
      {!loading && (
        <>
          {user ? (
            <>
              <NewInterviewButton />
              <UserDropdown user={user} />
            </>
          ) : (
            <SignInButton />
          )}
        </>
      )}
    </div>
  );
};

export default HeaderRightActions;
