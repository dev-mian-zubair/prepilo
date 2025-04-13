"use client";
import React from "react";

import UserDropdown from "./UserDropdown";
import SignInButton from "./SignInButton";
import NewInterviewButton from "./NewInterviewButton";

import { useAuth } from "@/providers/AuthProvider";

const HeaderRightActions = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <NewInterviewButton />
      {!loading && user ? <UserDropdown user={user} /> : <SignInButton />}
    </>
  );
};

export default HeaderRightActions;
