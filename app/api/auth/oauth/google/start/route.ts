import { NextResponse } from "next/server";
import { createOAuthState, getBaseUrlFromRequest, saveOAuthState } from "@/lib/oauth";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.redirect(new URL("/auth/login?error=google_not_configured", request.url));
  }

  const baseUrl = getBaseUrlFromRequest(request);
  const redirectUri = `${baseUrl}/api/auth/oauth/google/callback`;
  const state = createOAuthState();
  await saveOAuthState(state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
