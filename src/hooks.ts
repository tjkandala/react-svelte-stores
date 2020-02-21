import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { IStore } from "./types";
import { get } from "./stores";
import { Subscription } from "rxjs";

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
  selector: Selector<T, R>,
  selectorDeps?: React.DependencyList
) => {
  const [state, setState] = useState<R>(selector(get(store)));

  const subRef = useRef<Subscription>(null);

  useLayoutEffect(
    () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
      }

      if (selectorDeps) {
        setState(selector(get(store)));
      }

      subRef.current = store.subscribe(state => setState(selector(state)));

      return () => subRef.current.unsubscribe();
    },
    selectorDeps ? selectorDeps : []
  );

  return state;
};
