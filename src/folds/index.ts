/**
 * @copyright 2020 Yogesh Sajanikar
 */

/**
 * Fold each element of the input and aggregates it using the given function
 * @param fn Function that maps each input with folded value.
 * @param uinit Initial value to start fold over with.
 * @param iterator Iterator to be folded
 */
export async function fold<T, U>(
  fn: (uprev: U, t: T) => U,
  uinit: U,
  iterator: AsyncGenerator<T>
): Promise<U> {
  let t = await iterator.next();
  let u = uinit;
  while (!t.done) {
    u = fn(u, t.value);
    t = await iterator.next();
  }
  return u;
}
