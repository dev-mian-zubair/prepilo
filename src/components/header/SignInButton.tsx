import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { User2 } from "lucide-react";
import React from "react";

const SignInButton = () => {
  return (
    <Button as={Link} href="/signin" radius="full" size="sm" variant="bordered">
      <User2 className="size-4" />
      <span className="hidden md:flex">Sign In with Google</span>
    </Button>
  );
};

export default SignInButton;
