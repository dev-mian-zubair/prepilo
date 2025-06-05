import { NextResponse } from "next/server";

import { createClient } from "@/supabase/server";
import { captureUserDetails } from "@/actions/users";

export async function GET(request: Request) {
  // Extract search parameters and origin from the request URL
  const { searchParams, origin } = new URL(request.url);

  // Get the authorization code and the 'next' redirect path
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    console.error("No code provided in callback");
    throw new Error("No code provided");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth error:", error);
    throw error;
  }

  // Capture user details after successful OAuth
  if (data.user) {
    try {
      await captureUserDetails(data.user);
    } catch (error) {
      console.error("Error capturing user details:", error);
      // Don't throw here - we still want to complete the auth flow
    }
  }

  // Redirect to the intended page
  return NextResponse.redirect(new URL(next, origin));
}
