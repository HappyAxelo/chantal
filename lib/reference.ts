import { randomBytes } from "node:crypto";

// Unambiguous alphabet (no 0/O, 1/I/L).
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** e.g. BK-261020-7KQ4M9 / INQ-261020-H3XW2P */
export function makeReference(prefix: "BK" | "INQ", now = new Date()): string {
  const d = now.toISOString().slice(2, 10).replace(/-/g, "");
  const bytes = randomBytes(6);
  let code = "";
  for (const b of bytes) code += ALPHABET[b % ALPHABET.length];
  return `${prefix}-${d}-${code}`;
}
