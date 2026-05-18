import { NextResponse } from "next/server";
import { sessionCookieName, sessionMaxAge, signSession } from "@/lib/auth";
import { ensureModeratorAccount, findOrCreateOAuthUser } from "@/lib/users";
import { getBaseUrlFromRequest, verifyOAuthState } from "@/lib/oauth";

type FacebookTokenResponse = { access_token?: string };
type FacebookUserResponse = {
  id?: string;
  name?: string;
  email?: string;
  picture?: { data?: { url?: string } };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const isValidState = await verifyOAuthState(state);
  if (!code || !isValidState) {
    return NextResponse.redirect(new URL("/auth/login?error=oauth_state", request.url));
  }

  const clientId = process.env.FACEBOOK_CLIENT_ID?.trim();
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/auth/login?error=facebook_not_configured", request.url));
  }

  const baseUrl = getBaseUrlFromRequest(request);
  const redirectUri = `${baseUrl}/api/auth/oauth/facebook/callback`;
  const tokenUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", clientId);
  tokenUrl.searchParams.set("client_secret", clientSecret);
  tokenUrl.searchParams.set("redirect_uri", redirectUri);
  tokenUrl.searchParams.set("code", code);

  const tokenResponse = await fetch(tokenUrl.toString());
  const tokenData = (await tokenResponse.json()) as FacebookTokenResponse;
  if (!tokenResponse.ok || !tokenData.access_token) {
    return NextResponse.redirect(new URL("/auth/login?error=facebook_token", request.url));
  }

  const userUrl = new URL("https://graph.facebook.com/me");
  userUrl.searchParams.set("fields", "id,name,email,picture.type(large)");
  userUrl.searchParams.set("access_token", tokenData.access_token);
  const userResponse = await fetch(userUrl.toString());
  const userData = (await userResponse.json()) as FacebookUserResponse;
  if (!userResponse.ok || !userData.id) {
    return NextResponse.redirect(new URL("/auth/login?error=facebook_user", request.url));
  }

  const email = userData.email || `${userData.id}@facebook.local`;
  await ensureModeratorAccount();
  const user = await findOrCreateOAuthUser({
    email,
    nickname: userData.name || email.split("@")[0],
    avatarUrl: userData.picture?.data?.url,
    provider: "facebook",
    providerId: userData.id,
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
