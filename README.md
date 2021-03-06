# async-functional

The asynchronous generator `AsyncGenerator` appears on many occasions. For example, fetching a set of records from a REST API, or dealing with database records. This package tries to give a _functional_ flavor to dealing with such situations.

One can consider `AysncGenerator` as a stream. This library allows async generators to be treated in functional manner.

*New* JSON Path transformer added as functors so that it is possible to process set of JSONPaths together to create a single object.

## Contents

### Functional Operators

Inspired by `rxjs` and functional programming, this package gives operators such as `map`, `filter`, `zip`, `take` or `takeWhile` alongwith folds such as `foldl`. Hopefully, this allows programs to be implemented using simple `for` loop.

### _TODO_ - Controlled Parallalism

While working with multiple such async generators, this package will try to create a controlled parallalism.

## Documentation

### Prelude - A set of generic functions

#### Convert an Iterable into an async generator

```ts 
  import {of} from 'async-functional';

  const input = of([1,2,3,4,5]);

  // Now you can iterate using for..await..of
  for await (const i of input)
    console.log("Output: " + i);
```

#### Collect the result of async generator into a promise
```ts
  import {of, collect} from 'async-functional';

  const input = of([1,2,3,4,5]);
  // Convert it back into a promise
  const result = await collect(input);
```

### Functors and folds - Higher order functions
Functors and other higher order functions to process async generator.

#### Create a functor - Lift a function to process async generator

```ts
  import {functor, of} from 'async-functional';

  // Create a async generator from an array
  const input = of([1, 2, 3, 4, 5]);
  // A simple function to square the numbers
  const square = (x: number) => x * x;
  // Use functor to lift square to squareMap
  const squareMap = functor(square);

  // Use map to square each element
  for await (const i of squareMap(input)) {
    console.log('output = ' + i);
  }

```


#### Use map as a functor

```ts
import {map, of} from 'async-functional';

// Create a async generator from an array
const input = of([1, 2, 3, 4, 5]);

// Use map to square each element
for await (const i of map(x => x * x, input)) {
  console.log('output = ' + i);
}
```

#### Use filter to selectively iterate over elements
```ts
import {filter, of} from 'async-functional';

// Create a async generator from an array
const input = of([1, 2, 3, 4, 5]);

// Filter to remove odd elements
const evenFilter = (x: number) => x % 2 == 0

// Use map to square each element
for await (const i of filter(evenFilter, input)) {
  console.log('output = ' + i);
}

// Output =>
// output = 2
// output = 4

```

### JSON Path transformation

```ts
import {jsonPathNumber, jsonTransform, jsonPathBoolean} from '..';

  const numberMap = jsonPathNumber('$.number', 'mynumber');
  const booleanMap = jsonPathBoolean('$.result', 'myboolean');
  const transf = jsonTransform(nkeyMap, bkeyMap);
  const input = {
    number: 101.0,
    result: false,
  };
  const output = transf(input);

  // Should see { mynumber: 101.0, myboolean: false }

```