import { customAlphabet } from "nanoid";

/**
 * 부고 URL용 짧은 ID 생성 (7자리, 소문자+숫자)
 * 예: "a3x9k2m" → jangrae.com/bugo/a3x9k2m
 */
const generateId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 7);

export function createShortId(): string {
  return generateId();
}

/**
 * PIN 해시 (간단한 SHA-256, bcrypt 대신 경량화)
 * 보안 수준: PIN 4자리 + 서버 사이드 검증이므로 충분
 */
export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + "_bugo_salt_jangrae");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  const computed = await hashPin(pin);
  return computed === hash;
}
