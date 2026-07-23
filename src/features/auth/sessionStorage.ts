import { readJson, removeStorageItem, writeJson } from "@/utils/browserStorage";

export type UserSession = {
  email: string;
  name: string;
  createdAt: string;
};

const SESSION_STORAGE_KEY = "shopsy:user-session";

export function createSession(email: string): UserSession {
  const name = email.split("@")[0].split(/[._-]/).join(" ");

  return {
    email,
    name: name || "Shopper",
    createdAt: new Date().toISOString(),
  };
}

export function readSession(): UserSession | null {
  return readJson(SESSION_STORAGE_KEY);
}

export function saveSession(session: UserSession): void {
  writeJson(SESSION_STORAGE_KEY, session);
}

export function clearSession(): void {
  removeStorageItem(SESSION_STORAGE_KEY);
}
