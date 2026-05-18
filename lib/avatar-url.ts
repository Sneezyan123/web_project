export const DEFAULT_AVATAR = "/figma-assets/avatar-header.png";

const KNOWN_AVATARS = new Set([
  "/figma-assets/avatar-melior.png",
  "/figma-assets/avatar-thetremba.png",
  "/figma-assets/avatar-zagir.png",
  "/figma-assets/avatar-atomicprod.png",
  "/figma-assets/avatar-volynckyi.png",
  "/figma-assets/avatar-header.png",
]);

export function normalizeAvatarUrl(url: string | undefined | null): string {
  const raw = (url ?? "").trim();
  if (!raw) return DEFAULT_AVATAR;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^data:image\//i.test(raw)) return raw;

  if (raw.startsWith("/figma-assets/")) {
    if (KNOWN_AVATARS.has(raw)) return raw;
    return DEFAULT_AVATAR;
  }

  if (raw.startsWith("/assets/")) {
    return DEFAULT_AVATAR;
  }

  if (raw.startsWith("/uploads/")) {
    return raw;
  }

  return DEFAULT_AVATAR;
}
