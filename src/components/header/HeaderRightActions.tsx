import React from "react";

import UserDropdown from "./UserDropdown";
import SignInButton from "./SignInButton";
import NewInterviewButton from "./NewInterviewButton";

const HeaderRightActions = () => {
  const isLoggedIn = true;

  return (
    <>
      <NewInterviewButton />
      {isLoggedIn ? <UserDropdown /> : <SignInButton />}
    </>
  );
};

export default HeaderRightActions;
