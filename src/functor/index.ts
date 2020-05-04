/**
 * @copyright 2020 Yogesh Sajanikar
 */
import {logger} from '../logging';

/**
 * Accepts a function to transform paramter of type T, to U. It returns a function that takes an async generator of type T, and returns an
 * async generator of type U.
 *
 * @param fn Function to lift to async generator level.
 */
export function functor<T, U>(
  fn: (tval: T) => U
): (tgen: AsyncGenerator<T>) => AsyncGenerator<U> {
  logger.debug('Lifting function', {function: functor.name});
  return async function* lifted(tgen) {
    logger.debug('Lifted functor from', {function: lifted.name});
    for await (const t of tgen) {
      logger.debug('Lifted functor', {function: lifted.name, value: t});
      yield fn(t);
    }
  };
}

export function functorAsync<T, U>(
  fn: (tval: T) => Promise<U>
): (tgen: AsyncGenerator<T>) => AsyncGenerator<U> {
  logger.debug('Lifting function', {function: functor.name});
  return async function* lifted(tgen) {
    logger.debug('Lifted functor from', {function: lifted.name});
    for await (const t of tgen) {
      logger.debug('Lifted functor', {function: lifted.name, value: t});
      yield await fn(t);
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

/**
 * The filter uses a filter 'fn' which determines if an element of an iterator should be filtered through to the output iterator.
 *
 * @param fn A function which produces true, if an element should pass through. Else the element will not be filtered through.
 * @param iterator Input iterator on which a filter `fn` is applied.
 */
export async function* filter<T>(
  fn: (value: T) => boolean,
  iterator: AsyncGenerator<T>
) {
  for await (const t of iterator) {
    if (fn(t)) yield t;
  }
}

/**
 * This function iterates simultaneously on both iterator one at a time. And creates a pair and pushes it to output iterator. If one of the
 * iterator exhausts its elements, then this function stops iteration. In short the length of the output iterator is the length of the
 * shorter of the input iterator.
 *
 * @param titerator A left iterator,each element of it will be paired with right.
 * @param uiterator A right iterator to be paired with elements of left iterator.
 */
export async function* zip<T, U>(
  titerator: AsyncGenerator<T>,
  uiterator: AsyncGenerator<U>
): AsyncGenerator<[T, U]> {
  yield* zipWith((t, u) => [t, u], titerator, uiterator);
}

/**
 * This is same as `zip`, except a function `fn` is applied on each pair, and its result is pushed to output iterator.
 *
 * @param fn A function that works on the pair.
 * @param titerator Left iterator to be combined pairwise with right iterator.
 * @param uiterator Right iterator to be combined pairwise with left iterator.
 */
export async function* zipWith<T, U, V>(
  fn: (tvalue: T, uvalue: U) => V,
  titerator: AsyncGenerator<T>,
  uiterator: AsyncGenerator<U>
) {
  let tu = await Promise.all([titerator.next(), uiterator.next()]);
  while (!tu[0].done && !tu[1].done) {
    const applied = fn(tu[0].value, tu[1].value);
    yield applied;
    tu = await Promise.all([titerator.next(), uiterator.next()]);
  }
}

export function flatMap<T, U>(
  fn: (t: T) => U[]
): (titer: AsyncGenerator<T>) => AsyncGenerator<U> {
  return async function* flatMapInternal(titer: AsyncGenerator<T>) {
    for await (const t of titer) {
      const us = fn(t);
      for (const u of us) {
        yield u;
      }
    }
  };
}
