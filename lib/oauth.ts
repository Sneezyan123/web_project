import { cookies } from "next/headers";

const OAUTH_STATE_COOKIE = "u2u_oauth_state";

export function getBaseUrlFromRequest(request: Request) {
  const configured = process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return new URL(request.url).origin;
}

export function createOAuthState() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function saveOAuthState(state: string) {
  const store = await cookies();
  store.set({
    name: OAUTH_STATE_COOKIE,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
}

export async function verifyOAuthState(stateFromRequest: string | null) {
  const store = await cookies();
  const stored = store.get(OAUTH_STATE_COOKIE)?.value;
  store.set({
    name: OAUTH_STATE_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return Boolean(stored && stateFromRequest && stored === stateFromRequest);
}
