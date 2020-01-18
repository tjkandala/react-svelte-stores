# react-svelte-stores
Truly Reactive Stores for React

`npm i react-svelte-stores`

## Why?

* Separate your UI and business logic. Keep your component trees and your state trees clean and readable. 
* Write less React, write more TypeScript/JavaScript. Your code will be reusable in Svelte, React, Preact, etc. and much easier to unit test. Global state management is built in because state lives in your store objects, and your components are subscribed to them behind the scenes. Truly reactive stores!
* No need for `Provider`, `mapStateToProps`, `mapDispatchToProps`, etc. Just plug your store into a react-svelte-stores hook and write a concise component that is a pure function of your store's state. "Dispatch actions" by calling your custom store object methods.
* You can still write reducers if you really want to! [go to example]
* [Less code, fewer bugs](https://blog.codinghorror.com/the-best-code-is-no-code-at-all/). Static-typing and unit-testability are cherries on top!  

#### Pros and Cons (compared to Redux)
* One store (made up of multiple reducers) vs multiple stores is a non-issue. If you need one action to affect two stores, you can easily compose them with an action creator [go to example]. [Facebook's Flux architecture works this way](https://s3-us-west-2.amazonaws.com/samuel-blog/flux-explain.png), but with a dispatcher rather than store method composition like in react-svelte-stores.

* Redux is [stringly-typed](https://wiki.c2.com/?StringlyTyped), react-svelte-stores are strongly-typed. This makes debugging Redux easier, but defining action constants, typing your action constants, defining action types, and creating action creators is extreme overkill for all but the most expansive front end projects. With react-svelte-stores, you are given an update function with which you map the previous state to the next state. 

* The Redux ecosystem comes with really good async middleware such as Redux-Observable and Redux-Saga. With react-svelte-stores, you have to write your own async logic. This is both a pro and a con. You get more freedom, but you have to put more thought into your architecure and documentation to make your app maintainable. To help with this issue, react-svelte-stores provide `asyncUpdate`, which don't exist in Svelte stores, so you don't have to write async IIFEs in your update functions.

* As of v1.0.0, react-svelte-stores dont't support time-travel debugging. I'm going to look into it, as this is the 'killer app' for Redux in my opinion. If that's something you really need right now, there's a workaround (as long as you're willing to write reducers) [go to example]

## Usage

* Split your app's state tree into small and readable stores. You should split stores in the same way you'd split reducers in Redux. 

### hooks

#### useStoreState hook

```js
import { useStoreState } from "react-svelte-stores";
import { counter } from "./stores/counter";

const Counter = () => {
  const count = useStoreState(counter);

  return (
    <div>
      <p>{count}</p>
      <button onClick={counter.increment}>+</button>
      <button onClick={counter.decrement}>-</button>
      <button onClick={counter.reset}>Reset</button>
    </div>
  );
};

```

#### Primitive Store

```ts
import { writable } from "react-svelte-stores";

const createCounter = (initialValue: number) => {
  const { subscribe, update, set } = writable(initialValue);

  return {
    subscribe,
    incrementBy: (incrementor: number) => update(count => count + incrementor),
    increment: () => update(count => count + 1),
    decrement: () => update(count => count - 1),
    reset: () => set(initialValue)
  };
};

export const counter = createCounter(7);
```

#### Complex State Tree Store

* Shallow copy the state tree, or use immer, with `useSelectedStoreState` to prevent unnecessary re-renders of for unchanged selections.

#### useSubscribedState hook

### writable stores

#### update

#### asyncUpdate

### readable stores

### derived stores

### custom stores

### persisted stores

### debugging

TODO: loggin with proxy

TODO: TodoMVC 
