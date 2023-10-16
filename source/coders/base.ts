import { InvalidEncoding, InvalidBytes } from './exceptions.ts';
import { ByteArray } from './byteArray.ts';

const _valid_encoding_pattern = Symbol('valid_encoding_pattern');

export class BaseCoder {
  private [_valid_encoding_pattern]: RegExp;
  constructor({
    valid_encoding_pattern
  }: { valid_encoding_pattern: RegExp }) {
    this[_valid_encoding_pattern] = valid_encoding_pattern;
  }

  decode(encoding: string): Uint8Array {
    if(this.isValidEncoding(encoding)) {
      return this.decodeTrusted(encoding)
    } else {
      throw new InvalidEncoding(`Encoding [${encoding}] does not satisfy [${this[_valid_encoding_pattern]}]`)
    }
  }

  decodeTrusted(encoding: string) {
    return ByteArray.generateRandomFilled();
  }

  encodeTrusted(bytes: Uint8Array) {
    return '';
  }

  encode(bytes: Uint8Array) {
    if(this.isValidBytes(bytes)) {
      return this.encodeTrusted(bytes);
    } else {
      throw new InvalidBytes(`Requires a 16-byte Uint8Array`);
    }
  }

  isValidBytes(bytes: unknown): bytes is Uint8Array {
    return bytes instanceof Uint8Array && bytes.length === 16;
  }

  isValidEncoding(encoding: unknown): encoding is string {
    return (typeof encoding === 'string') &&
      this[_valid_encoding_pattern].test(encoding);
  }
}