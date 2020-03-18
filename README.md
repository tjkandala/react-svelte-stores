# react-svelte-stores

Truly Reactive Stores for React.
Inspired by [Svelte](https://svelte.dev/tutorial/writable-stores)

`npm i react-svelte-stores`

## Why?

- I wanted a good set of primitives with which I could __build custom state management solutions__.

- I wanted a "cleaner" API than React's Context. 

- Gateway drug to Svelte, or a way for people who already love Svelte to write Svelte-like code in React.

## Examples

### FSM Audio Player

You can use react-svelte-stores to create a finite state machine component that can receive messages from other components.

- The state enum or string union represents the vertices of a state diagram.
- The switch cases in the reducer function represent the edges of a state diagram; the transitions between states.
- Side effects are handled in `useEffect` 


### Persisted Service


## API Reference

### Hooks

#### `useStoreState(store: IStore<T>): T`

#### `useSelectedStoreState(store: IStore<T>, selector: <T, R>(state: T) => R): R`

* Compatible with reselect

### Stores

#### `writable(initialState: T): IWritableStore<T>`

#### `readable(initialState: T, setCallback?: ReadableSetCallback<T>): IReadableStore<T>`

#### `persisted(initialState: T, storeKey: string, throttleMs?: number): IWritableStore<T>`

#### `persistedAsync(initialState: T, storeKey: string, AsyncStorage: AsyncStorageStatic, throttleMs?: number): IWritableStore<T>`

Custom stores must expose the subscribe function to be usable with hooks.
