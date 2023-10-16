import HexCoder from '../hex.ts';
import { assertEquals, assertThrows } from 'https://deno.land/std@0.204.0/assert/mod.ts';

Deno.test('Hex Encoder', async t => {
  const hex = new HexCoder();

  const zeroByteArray = Uint8Array.from({ length: 16 }, () => 0);
  const zeroByteString = '0'.repeat(32);

  const fullByteArray = Uint8Array.from({ length: 16}, () => 0xff);
  const fullByteString = 'FF'.repeat(16);

  // These two things were created by calling a random byte generating function and then encoding the values.
  const randomEncodedBytes = Uint8Array.from([
    164, 96, 249, 183, 194,
    47, 81, 227, 187, 32,
    118, 229, 61, 187, 230,
    4
  ]);

  const randomEncodedString = 'A460F9B7C22F51E3BB2076E53DBBE604';

  await t.step('Encoding works', () => {
    assertEquals(hex.encode(zeroByteArray), zeroByteString);
    assertEquals(hex.encode(randomEncodedBytes), randomEncodedString);
    assertEquals(hex.encode(fullByteArray), fullByteString);
  });

  await t.step('Decoding works', () => {
    assertEquals(hex.decode(zeroByteString), zeroByteArray);
    assertEquals(hex.decode(randomEncodedString), randomEncodedBytes);
    assertEquals(hex.decode(fullByteString), fullByteArray);
  });

  await t.step('Throws on bad data', () => {
    // @ts-expect-error: testing throwing on incorrect types
    assertThrows(hex.encode.bind(null, []));

    assertThrows(hex.decode.bind(null, 'OG'.repeat(16)));
    assertThrows(hex.decode.bind(null, ''));
  });
});