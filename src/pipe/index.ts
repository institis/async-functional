/**
 * @copyright 2020 Yogesh Sajanikar
 */

import {compose} from '../prelude';
import {flatMap, functor, functorAsync} from '../functor';

export type AsyncGeneratorTransform<T, U> = (
  input: AsyncGenerator<T>
) => AsyncGenerator<U>;

export class Pipe<T, U> {
  constructor(private op: AsyncGeneratorTransform<T, U>) {}

  map<V>(fn: (u: U) => V): Pipe<T, V> {
    const lifted = functor(fn);
    return this.compose(lifted);
  }

  mapAsync<V>(fn: (u: U) => Promise<V>): Pipe<T, V> {
    const lifted = functorAsync(fn);
    return this.compose(lifted);
  }

  flatMap<V>(next: (u: U) => V[]): Pipe<T, V> {
    const flattened = flatMap(next);
    return this.compose(flattened);
  }

  compose<V>(next: AsyncGeneratorTransform<U, V>): Pipe<T, V> {
    const nextpipe = compose(this.op, next);
    return new Pipe(nextpipe);
  }

  async *run(input: AsyncGenerator<T>): AsyncGenerator<U> {
    yield* this.op(input);
  }

  public static liftFunction<T, U>(fn: (t: T) => U): Pipe<T, U> {
    return new Pipe(functor(fn));
  }

  public static liftFlatMap<T, U>(fn: (t: T) => U[]): Pipe<T, U> {
    return new Pipe(flatMap(fn));
  }
}
