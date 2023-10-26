import Crypto from "node:crypto";

const BUFFER_SIZE = 4096 /* typical page size */ - 96; /* Empty buffer overhead */

const buffer = new Uint8Array(BUFFER_SIZE);
let offset = BUFFER_SIZE;

export function randomBytes(size: number) {
    if (offset + size >= BUFFER_SIZE) {
        offset = 0;
        Crypto.randomFillSync(buffer);
    }

    return buffer.slice(offset, (offset += size));
}

const MAX_BYTES = 16;

export const HEX_ALPHABET = "0123456789ABCDEF";

export const BYTE_TO_HEX = Array.from({ length: HEX_ALPHABET.length * HEX_ALPHABET.length }).map(
    (_, key) =>
        `${HEX_ALPHABET.charAt(key / HEX_ALPHABET.length)}${HEX_ALPHABET.charAt(
            key % HEX_ALPHABET.length
        )}`
);

const VALID_HEX_PATTERN = /^[0-9A-Fa-f]{32}$/;

export function decodeToHexBytes(encoding: string) {
    if (!VALID_HEX_PATTERN.test(encoding)) throw new Error("nope");

    const bytes = new Uint8Array(16);

    for (let dst = 0, hi_hex = true, src = 0, end = encoding.length; src < end; ++src) {
        const hex = encoding[src];
        if (hi_hex) {
            bytes[dst] = HEX_TO_BYTE[hex] << 4;
        } else {
            bytes[dst++] |= HEX_TO_BYTE[hex];
        }
        hi_hex = !hi_hex;
    }

    return bytes;
}

export function encodeFromHexBytes(bytes: Uint8Array) {
    let encoding = "";
    for (let idx = 0, end = bytes.length; idx < end; ++idx) {
        encoding += BYTE_TO_HEX[bytes[idx]];
    }
    return encoding;
}

export class ByteArray {
    static compare(lhs: Uint8Array, rhs: Uint8Array) {
        const mismatch_idx = lhs.findIndex((byt, idx) => byt !== rhs[idx]);
        return ~mismatch_idx && Math.sign(lhs[mismatch_idx] - rhs[mismatch_idx]);
    }

    static generateOneFilled() {
        return Uint8Array.from({ length: MAX_BYTES }, _ => 0xff);
    }

    static generateRandomFilled() {
        return randomBytes(MAX_BYTES);
    }

    static generateZeroFilled() {
        return Uint8Array.from({ length: MAX_BYTES }, _ => 0);
    }
}
