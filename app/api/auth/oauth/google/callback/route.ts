import { NextResponse } from "next/server";
import { sessionCookieName, sessionMaxAge, signSession } from "@/lib/auth";
import { ensureModeratorAccount, findOrCreateOAuthUser } from "@/lib/users";
import { getBaseUrlFromRequest, verifyOAuthState } from "@/lib/oauth";

type GoogleTokenResponse = { access_token?: string };
type GoogleUserInfo = { sub?: string; email?: string; name?: string; picture?: string };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const isValidState = await verifyOAuthState(state);
  if (!code || !isValidState) {
    return NextResponse.redirect(new URL("/auth/login?error=oauth_state", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/auth/login?error=google_not_configured", request.url));
  }

  const baseUrl = getBaseUrlFromRequest(request);
  const redirectUri = `${baseUrl}/api/auth/oauth/google/callback`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });
  const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
  if (!tokenResponse.ok || !tokenData.access_token) {
    return NextResponse.redirect(new URL("/auth/login?error=google_token", request.url));
  }

  const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = (await userResponse.json()) as GoogleUserInfo;
  if (!userResponse.ok || !userData.email || !userData.sub) {
    return NextResponse.redirect(new URL("/auth/login?error=google_user", request.url));
  }

  await ensureModeratorAccount();
  const user = await findOrCreateOAuthUser({
    email: userData.email,
    nickname: userData.name || userData.email.split("@")[0],
    avatarUrl: userData.picture,
    provider: "google",
    providerId: userData.sub,
  });

  const token = await signSession({ userId: user.id, email: user.email });
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set({
    name: sessionCookieName,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge,
  });
  return response;
}
