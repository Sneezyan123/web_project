import { NextResponse } from "next/server";
import { createOAuthState, getBaseUrlFromRequest, saveOAuthState } from "@/lib/oauth";

export async function GET(request: Request) {
  const clientId = process.env.FACEBOOK_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.redirect(new URL("/auth/login?error=facebook_not_configured", request.url));
  }

  const baseUrl = getBaseUrlFromRequest(request);
  const redirectUri = `${baseUrl}/api/auth/oauth/facebook/callback`;
  const state = createOAuthState();
  await saveOAuthState(state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    response_type: "code",
    scope: "email,public_profile",
  });

  return NextResponse.redirect(`https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`);
}
