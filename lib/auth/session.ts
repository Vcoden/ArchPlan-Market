import { getSessionAccount, getSessionArchitect } from "@/lib/auth/account";
import type { Profile } from "@/types";

export async function getSessionUser() {
  return getSessionAccount();
}

export async function getCurrentProfile() {
  return getSessionAccount();
}

export async function getCurrentArchitect() {
  return getSessionArchitect();
}

export function requireRole(profile: Profile | null, roles: Profile["role"][]) {
  return Boolean(profile && roles.includes(profile.role) && !profile.is_suspended);
}
