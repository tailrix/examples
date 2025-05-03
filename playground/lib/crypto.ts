import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

// 32‑byte base‑64‑encoded secret →   `openssl rand -base64 32`
const ENC_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "base64");
const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

export function encrypt(plain: string): string {
    const iv = randomBytes(IV_LEN);
    const cipher = createCipheriv(ALGO, ENC_KEY, iv);

    const ciphertext = Buffer.concat([
        cipher.update(plain, "utf8"),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

export function decrypt(encoded: string): string {
    const buf = Buffer.from(encoded, "base64");
    const iv = buf.subarray(0, IV_LEN);
    const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
    const ct = buf.subarray(IV_LEN + TAG_LEN);

    const decipher = createDecipheriv(ALGO, ENC_KEY, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}
