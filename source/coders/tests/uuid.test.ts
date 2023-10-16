import { UuidCoder } from '../uuid.ts';

import { assertEquals, assertThrows } from 'https://deno.land/std@0.204.0/assert/mod.ts';
Deno.test('UUID Encoder', async t => {
  const uuid = new UuidCoder();

  const zeroBytearray = Uint8Array.from({ length: 16 }, () => 0);
  const fullArray = Uint8Array.from({ length: 16 }, () => 0xff);

  const zeroEncoded = '00000000-0000-0000-0000-000000000000';
  const fullEncoded = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';

  // These two things were created by calling a random byte generating function and then encoding the values.
  const randomEncodedBytes = Uint8Array.from([
    164, 96, 249, 183, 194,
    47, 81, 227, 187, 32,
    118, 229, 61, 187, 230,
    4
  ]);

  const randomEncodedString = 'A460F9B7-C22F-51E3-BB20-76E53DBBE604'

  await t.step('Encodes Properly', () => {
    assertEquals(uuid.encode(zeroBytearray), zeroEncoded);
    assertEquals(uuid.encode(fullArray), fullEncoded);
    assertEquals(uuid.encode(randomEncodedBytes), randomEncodedString);
  });

  await t.step('Decodes Properly', () => {
    assertEquals(uuid.decode(zeroEncoded), zeroBytearray);
    assertEquals(uuid.decode(fullEncoded), fullArray);
    assertEquals(uuid.decode(randomEncodedString), randomEncodedBytes);
  });

});