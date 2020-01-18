import { useState, useLayoutEffect } from "react";
import { IStore } from "./types";
import { get } from "./stores";

type Selector<T, R> = (store: T) => R;

/** State of a react-svelte-stores store */
export const useStoreState = <T>(store: IStore<T>) => {
  const [state, setState] = useState<T>(get(store));

  useLayoutEffect(() => {
    const subscription = store.subscribe(state => setState(state));

    return () => subscription.unsubscribe();
  }, []);

  return state;
};

/** Selector to prevent unnecesary re-renders. Used when store value is not a primitive. Use memoized selectors if your selector involves expensive computations  */
export const useSelectedStoreState = <T, R>(
  store: IStore<T>,
  selector: Selector<T, R>
) => {
  const [state, setState] = useState<R>(selector(get(store)));

  useLayoutEffect(() => {
    const subscription = store.subscribe(state => setState(selector(state)));

    return () => subscription.unsubscribe();
  }, []);

  return state;
};
