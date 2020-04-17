/**
 * @copyright 2020 Yogesh Sajanikar
 */

/**
 * Converts an iterator to an async generator of same type.
 *
 * @param iterator Input iterator
 */
export async function* of<T>(iterator: Iterable<T>) {
  for await (const t of iterator) yield t;
}

/**
 * Collect results of the async generator in a promise.
 *
 * @param iterator Input iterator.
 */
export async function collect<T>(iterator: AsyncGenerator<T>) {
  const output: T[] = [];
  for await (const t of iterator) output.push(t);
  return output;
}

export async function* take<T>(titerator: AsyncGenerator<T>, num: number) {
  let t = await titerator.next();
  let n = 0;
  while (!t.done && n < num) {
    yield t.value;
    t = await titerator.next();
    n = n + 1;
  }
}

export async function* takeWhile<T>(
  titerator: AsyncGenerator<T>,
  fn: (value: T) => boolean
) {
  let t = await titerator.next();
  while (!t.done && fn(t.value)) {
    yield t.value;
    t = await titerator.next();
  }
}

export function compose<T, U, V>(
  ufn: (tval: T) => U,
  vfn: (vval: U) => V
): (tval: T) => V {
  return (t: T) => {
    const u = ufn(t);
    const v = vfn(u);
    return v;
  };
}
