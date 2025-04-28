import { createClient } from "@/supabase/client";

const supabase = createClient();

export const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
    throw error;
  }

  window.location.href = "/";
};
