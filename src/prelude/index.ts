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
 * An identity function, simply yields each elements in the input iterator.
 * @param iterator Input iterator
 */
export async function* id<T>(iterator: AsyncGenerator<T>) {
  for await (const i of iterator) yield i;
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

/**
 * Take only `num` elements from the input iterator. The resultant iterator
 * @param titerator Input iterator
 * @param num How many elements we need from the input iterator
 */
export async function* take<T>(titerator: AsyncGenerator<T>, num: number) {
  let n = 0;
  while (n < num) {
    const t = await titerator.next();
    if (t.done) break;
    yield t.value;
    n = n + 1;
  }
}

/**
 * Fetches elements of input iterator as long as they satisfy the condition specified by `fn`.
 * @param titerator Input iterator
 * @param fn A function that returns boolean
 */
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

/**
 * Compose two functions ufn, vfn such that value of function is vfn(ufn(x))
 * @param ufn Output of 'ufn' is passed to 'vfn'
 * @param vfn 'vfn' produces final output that is result of composed function
 */
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

export async function* single<T>(t: T) {
  yield t;
}

export function composeAll(...args: any[]) {
  return args.reduce((p, c) => compose(p, c), id);
}
