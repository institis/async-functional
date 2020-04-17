# async-functional
The asynchronous generator `AsyncGenerator` appears on many occasions. For example, fetching a set of records from a REST API, or dealing with database records. This package tries to give a *functional* flavor to dealing with such situations. 

## Functional Operators
Inspired by `rxjs` and functional programming, this package gives operators such as `map`, `filter`, `zip`, `take` or `takeWhile` alongwith folds such as `foldl`. Hopefully, this allows programs to be implemented using simple `for` loop.

## *TODO* - Controlled Parallalism
While working with multiple such async generators, this package will try to create a controlled parallalism. 

## Example
A couple of samples for working with `async-functionl`

### Applying Map
```ts
  import {map, of} from 'async-functional';

  // Create a async generator from an array
  const input = of([1, 2, 3, 4, 5]);

  // Use map to square each element
  for await (const i of map(x => x * x, input)) {
    console.log('output = ' + i);
  }

```

### OR Lift a function to a map 

```ts
  import {functor, of} from 'async-functional';

  // Create a async generator from an array
  const input = of([1, 2, 3, 4, 5]);
  const squareMap = functor((x: number) => x * x);

  // Use map to square each element
  for await (squareMap(input, x => x * x)) {
    console.log('output = ' + i);
  }

```
