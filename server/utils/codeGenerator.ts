const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" as const;

export function generateCode(length = 6) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => ALPHABET[byte % ALPHABET.length])
    .join("");
}
