# react-svelte-stores

Truly Reactive Stores for React.
Inspired by [Svelte](https://svelte.dev/tutorial/writable-stores)

`npm i react-svelte-stores`

## Why?

- I really enjoy using Svelte for rapid prototyping. Svelte's stores, like most Svelte features, allow you to focus on features, not boilerplate.

- I wanted to use Svelte stores with React Native and with TypeScript.

- I wanted to use a state management library with persistence built-in. Use `persisted` (for localStorage) and `persistedAsync` (for AsyncStorage) to create a store that automatically serializes and rehydrates its state.

- No need for `Provider`, `mapStateToProps`, `mapDispatchToProps`, etc. Just plug your store into a react-svelte-stores hook and write a concise component that is a pure function of your store's state. "Dispatch actions" by calling your custom store object methods.

- [Less code, fewer bugs](https://blog.codinghorror.com/the-best-code-is-no-code-at-all/). Static-typing and unit-testability are cherries on top!

- \*When I'm ready to make a "final version"/"production quality" application, I reach for Redux and Redux Observable. Redux's debugging experience and predictabilty are unmatched. However, react-svelte-stores and vanilla RxJS make development so easy that I use them for all prototypes/PoCs.

## Usage

- react-svelte-stores are meant for applications that require shared state, but will never grow to need Redux or other more robust state management libraries. I would place it in between the React Context API and Redux in terms of power.

- I recommend using react-svelte-stores when you have a narrow and shallow state tree, or a wide and shallow state tree. When you have deep state trees and find yourself needing performance optimizations such as memoized selectors (compatible w/ react-svelte-stores), you should use Redux. React-Redux has a lot of performance benefits that react-svelte-stores will never match because I use it for prototyping.

## Examples
