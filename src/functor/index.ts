/**
 * @copyright 2020 Yogesh Sajanikar
 */

export function functor<T, U>(
  fn: (tval: T) => U
): (tgen: AsyncGenerator<T>) => AsyncGenerator<U> {
  return async function* lifted(tgen) {
    for await (const t of tgen) {
      yield fn(t);
    }
  };
}

/**
 * Map input to output using given function `fn`
 * @param iterator Iterator of type t
 * @param fn Function that takes type T and returns type U
 */
export async function* map<T, U>(
  fn: (value: T) => U,
  iterator: AsyncGenerator<T>
) {
  for await (const t of iterator) {
    const u = fn(t);
    yield u;
  }
}

export async function* filter<T>(
  iterator: AsyncGenerator<T>,
  fn: (value: T) => boolean
) {
  for await (const t of iterator) {
    if (fn(t)) yield t;
  }
}

export async function* zip<T, U>(
  titerator: AsyncGenerator<T>,
  uiterator: AsyncGenerator<U>
) {
  let t = await titerator.next();
  let u = await uiterator.next();
  while (!t.done && !u.done) {
    yield [t.value, u.value];
    t = await titerator.next();
    u = await uiterator.next();
  }
}

export async function* zipWith<T, U, V>(
  titerator: AsyncGenerator<T>,
  uiterator: AsyncGenerator<U>,
  fn: (tvalue: T, uvalue: U) => V
) {
  let t = await titerator.next();
  let u = await uiterator.next();
  while (!t.done && !u.done) {
    yield fn(t.value, u.value);
    t = await titerator.next();
    u = await uiterator.next();
  }
}

export async function* of<T>(iterator: Iterable<T>) {
  for await (const t of iterator) yield t;
}

export async function collect<T>(iterator: AsyncGenerator<T>) {
  const output: T[] = [];
  for await (const t of iterator) output.push(t);
  return output;
}
