import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "u2u_session";
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SECRET environment variable");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  email: string;
};

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${WEEK_IN_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySession(token: string) {
  const verified = await jwtVerify<SessionPayload>(token, getSecretKey());
  return verified.payload;
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}

export const sessionCookieName = COOKIE_NAME;
export const sessionMaxAge = WEEK_IN_SECONDS;
