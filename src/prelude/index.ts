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
