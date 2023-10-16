
import Crypto from 'node:crypto';

const BUFFER_SIZE = 4096 /* typical page size */ - 96 /* Empty buffer overhead */;

const buffer = new Uint8Array(BUFFER_SIZE)
let offset = BUFFER_SIZE;

export function randomBytes(size: number) {
  if (offset + size >= BUFFER_SIZE) {
    offset = 0;
    Crypto.randomFillSync(buffer)
  }

  return buffer.slice(offset, offset += size);
}

const MAX_BYTES = 16;

export class ByteArray {
  static compare(lhs: Uint8Array, rhs: Uint8Array) {
    const mismatch_idx = lhs.findIndex((byt, idx) => (byt !== rhs[idx]));
    return ~mismatch_idx && Math.sign(lhs[mismatch_idx] - rhs[mismatch_idx]);
  }

  static generateOneFilled() {
    return Uint8Array.from({ length: MAX_BYTES}, _ => 0xFF);
  }

  static generateRandomFilled() {
    return randomBytes(MAX_BYTES);
  }

  static generateZeroFilled() {
    return Uint8Array.from({ length: MAX_BYTES}, _ => 0);
  }
}