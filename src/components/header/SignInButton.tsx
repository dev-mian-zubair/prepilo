"use client";
import { Button } from "@heroui/button";
import { User2 } from "lucide-react";
import React, { useState } from "react";

import { createClient } from "@/supabase/client";

const SignInButton = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const signIn = async (provider: "google" | "github") => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (data?.url) {
      window.location.href = data.url;
    }

    if (error) {
      console.error(`${provider} Sign-In Error:`, error.message);
      setMessage(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in failed. Try again.`,
      );
    }
    setLoading(false);
  };

  return (
    <Button
      className="font-semibold"
      color="primary"
      disabled={loading}
      radius="full"
      size="md"
      onPress={() => signIn("google")}
    >
      <User2 className="size-4" />
      <span className="hidden md:flex">Sign In with Google</span>
    </Button>
  );
};

export default SignInButton;
