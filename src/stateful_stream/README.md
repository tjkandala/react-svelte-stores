## Stateful Stream

```ts
const countStream = new StatefulStream(1);

const mySub = countStream.subscribe(value => console.log(value));
// console: 1

countStream.next(3);
// console: 3

countStream.next(5);
// console: 5
```
