import { Crockford32Coder } from '../crockford.ts';
import { assertEquals, assertThrows  } from 'https://deno.land/std@0.204.0/assert/mod.ts';

Deno.test('Test Crockford Encoder', async t  => {
  const crockford = new Crockford32Coder();

  const zeroBytearray = Uint8Array.from({ length: 16}, () => 0);
  const fullArray = Uint8Array.from({ length: 16}, () => 0xff);

  const zeroEncoded = '0'.repeat(26);
  const fullEncoded = '7'+ ('Z'.repeat(25));

  // These two things were created by calling a random byte generating function and then encoding the values.
  const randomEncodedBytes = Uint8Array.from([
    164, 96, 249, 183, 194,
    47, 81, 227, 187, 32,
    118, 229, 61, 187, 230,
    4
  ]);
  const randomEncodedString = '54C3WVFGHFA7HVP83PWMYVQSG4';

  await t.step('Encodes Correctly', () => {
    assertEquals(crockford.encode(zeroBytearray), zeroEncoded);
    assertEquals(crockford.encode(fullArray), fullEncoded);
    assertEquals(crockford.encode(randomEncodedBytes), randomEncodedString);
  });


  await t.step('Decodes correctly', () => {
    assertEquals(crockford.decode(randomEncodedString), randomEncodedBytes);
    assertEquals(crockford.decode(fullEncoded), fullArray);
    assertEquals(crockford.decode(zeroEncoded), zeroBytearray);
  });

  await t.step('Throws on bad data', () => {
    // @ts-expect-error: testing throwing assumptions by passing non Uint8Array
    assertThrows(crockford.encode.bind(null, []));
    // Should error due to array being too long
    assertThrows(crockford.encode.bind(null, Uint8Array.from({ length: 20})), 'Throws on invalid encode parameters');
    // Should error because the front number should never hit 9.
    assertThrows(crockford.decode.bind(null, '9'.repeat(26)), 'Throws on bad strings');
    // Should error because the string is empty
    assertThrows(crockford.decode.bind(null, ''), 'Throws on empty strings');
    // Should error because 'l' is not in the crockford alphabet
    assertThrows(crockford.decode.bind(null, '0'+('l'.repeat(25))))
  });


});