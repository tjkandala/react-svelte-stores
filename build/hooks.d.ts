import { IStore } from "./types";
declare type Selector<T, R> = (store: T) => R;
/** State of a react-svelte-stores store */
export declare const useStoreState: <T>(store: IStore<T>) => T;
/** Selector to prevent unnecesary re-renders. Used when store value is not a primitive. Use memoized selectors if your selector involves expensive computations  */
export declare const useSelectedStoreState: <T, R>(store: IStore<T>, selector: Selector<T, R>, selectorDeps?: import("react").DependencyList) => R;
export {};
