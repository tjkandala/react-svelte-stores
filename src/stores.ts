import { IWritableStore, IReadableStore, IStore } from "./types";
import { StatefulStream } from "./stateful_stream";
import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
if (typeof localStorage === "undefined" || localStorage === null) {
  var localStorage: any = require("localStorage");
}
import AsyncStorage, {
  AsyncStorageStatic
} from "@react-native-community/async-storage";

/** Initializes a writable store */
export const writable = <T>(initialState: T): IWritableStore<T> => {
  const statefulStream = new StatefulStream(initialState);

  return {
    subscribe: callback => statefulStream.subscribe(callback),
    /** Pass the update method a callback to update the store */
    update: updateFunction => {
      const nextState = updateFunction(statefulStream._getValue());

      statefulStream.next(nextState);
    },
    asyncUpdate: async updateFunction => {
      try {
        const updatePromise = updateFunction(statefulStream._getValue());
        const nextState = await updatePromise;

        statefulStream.next(nextState);
      } catch (err) {
        console.error(err);
      }
    },
    set: nextState => statefulStream.next(nextState)
  };
};

type SetFunction<T> = (nextState: T) => void;

type ReadableSetCallback<T> = (setFn: SetFunction<T>) => void;

/** Initializes a readable store */
export const readable = <T>(
  initialState: T,
  setCallback?: ReadableSetCallback<T>
): IReadableStore<T> => {
  const statefulStream = new StatefulStream(initialState);

  const setFn: SetFunction<T> = nextState => statefulStream.next(nextState);

  if (setCallback) {
    setCallback(setFn);
  }

  return {
    subscribe: callback => statefulStream.subscribe(callback)
  };
};

type DeriveStateCallback<A, R> = (state: A) => R;

/** Initializes a derived store. Typically, you should just make a custom writable/persisted store and subscribe to slices of its state with selectors. */
export function derived<A, R>(
  store: IStore<A>,
  deriveStateCallback: DeriveStateCallback<A, R>
): IReadableStore<R> {
  const { subscribe, set } = writable(deriveStateCallback(get(store)));

  store.subscribe(state => {
    set(deriveStateCallback(state));
  });

  return {
    subscribe
  };
}

interface IPersistedStore<T> extends IWritableStore<T> {}

/** Initializes a persisted writable store. 0ms throttle by default. For use with localStorage */
export const persisted = <T>(
  initialState: T,
  storeKey: string,
  throttleMs: number = 0
): IPersistedStore<T> => {
  const persistedStateString: string | null = localStorage.getItem(storeKey);
  let persistedState: T | null;
  if (persistedStateString) {
    persistedState = JSON.parse(persistedStateString);
  } else {
    persistedState = null;
  }

  // fix for boolean stores: persisted "false" when initial state is "true" resulted in
  // an effective state reset on refresh. this happens bc check for persisted state will return false even
  // if it exists (bc the value is literally false)
  const { subscribe, update, asyncUpdate, set } = writable(
    typeof persistedState === "boolean"
      ? persistedState
      : persistedState
      ? persistedState
      : initialState
  );

  const persistor$ = new Subject();

  subscribe(state => persistor$.next(state));

  persistor$
    .pipe(throttleTime(throttleMs))
    .subscribe(state => localStorage.setItem(storeKey, JSON.stringify(state)));

  return {
    subscribe,
    update,
    asyncUpdate,
    set
  };
};

/** Initializes a persisted writable store. 0ms throttle by default. For use with AsyncStorage (React Native) */
export const persistedAsync = <T>(
  initialState: T,
  storeKey: string,
  AsyncStorage: AsyncStorageStatic,
  throttleMs: number = 0
): IPersistedStore<T> => {
  const { subscribe, update, asyncUpdate, set } = writable(initialState);

  // console.log("1");
  (async () => {
    // console.log("2");
    const persistedStateString: string | null = await AsyncStorage.getItem(
      storeKey
    );
    // console.log("4");

    if (persistedStateString) {
      const persistedState: T = JSON.parse(persistedStateString);
      set(persistedState);
    }
  })();

  // console.log("3");

  const persistor$ = new Subject();

  subscribe(state => persistor$.next(state));

  persistor$.pipe(throttleTime(throttleMs)).subscribe(async state => {
    await AsyncStorage.setItem(storeKey, JSON.stringify(state));
  });

  return {
    subscribe,
    update,
    asyncUpdate,
    set
  };
};

/** Get current value of a store without subscribing to it */
export const get = <T>(store: IStore<T>): T => {
  let value: T;
  store.subscribe(state => (value = state)).unsubscribe();
  return value;
};

/** Log your store's state changes over time, helpful for debugging */
export const log = <T>(name: string, store: IStore<T>): void => {
  store.subscribe(state => {
    console.log({
      store: name,
      state: state
    });
  });
};
