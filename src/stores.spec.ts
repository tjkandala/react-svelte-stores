import { readable, derived } from "./index";
import { get, writable, persisted, persistedAsync } from "./stores";
var localStorage: any = require("localStorage");

describe("readable store", () => {
  test("works", () => {
    const store = readable(1);
    store.subscribe((state) => expect(state).toBe(1));
  });

  test("set function works", () => {
    const store = readable(1, (set) => set(2));
    store.subscribe((state) => expect(state).toBe(2));
  });

  test("set function works with settimeout", async () => {
    const store = readable(1, (set) => {
      setTimeout(() => set(2), 1000);
    });
    expect(get(store)).toBe(1);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    expect(get(store)).toBe(2);
  });
});

describe("derived store", () => {
  test("works", () => {
    const originalStore = writable(1);
    const derivedStore = derived(originalStore, (state) => state.toString());
    expect(get(derivedStore)).toBe("1");
    originalStore.update((state) => state + 1);
    expect(get(derivedStore)).toBe("2");
  });
});

describe("writable store", () => {
  test("works", () => {
    const store = writable(1);
    store.subscribe((state) => expect(state).toBe(1));
  });

  test("update works", () => {
    const store = writable(1);
    store.update((state) => state + 1);
    store.subscribe((state) => expect(state).toBe(2));
  });

  test("async update works", async () => {
    const store = writable(1);
    store.asyncUpdate(async (state) => {
      return state + 1;
    });
    expect(get(store)).toBe(1);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(get(store)).toBe(2);
  });
});

describe("custom store", () => {
  test("works", () => {
    const createCounter = (initialState: number) => {
      const { subscribe, update, set } = writable(initialState);

      return {
        subscribe,
        increment: () => update((state) => state + 1),
        incrementBy: (incrementor: number) =>
          update((state) => state + incrementor),
        decrement: () => update((state) => state - 1),
        reset: () => set(initialState),
      };
    };
    const counterStore = createCounter(1);

    expect(get(counterStore)).toBe(1);
    counterStore.increment();
    expect(get(counterStore)).toBe(2);
    counterStore.decrement();
    expect(get(counterStore)).toBe(1);
    counterStore.incrementBy(3);
    expect(get(counterStore)).toBe(4);
    counterStore.reset();
    expect(get(counterStore)).toBe(1);

    counterStore.subscribe((state) => expect(state).toBe(1));
  });
});

// TEST PERSISTED STORE
describe("persisted store", () => {
  test("works", () => {
    const obj = { id: 1, label: "ball" };

    const store = persisted(obj, "obj");
    expect(get(store)).toBe(obj);

    const nextState = { id: 2, label: "code" };

    store.set(nextState);

    const persistedStringState = localStorage.getItem("obj");
    const persistedState = JSON.parse(persistedStringState);
    expect(persistedState).toStrictEqual(nextState);
  });
});

import AsyncStorage from "@react-native-community/async-storage";

describe("async persisted store", () => {
  test("works", async () => {
    const initState = { id: 1, label: "ball" };
    const nextState = { id: 2, label: "dunk" };

    const store = persistedAsync(initState, "asyncstore", AsyncStorage);

    expect(get(store)).toBe(initState);

    store.set(nextState);

    expect(get(store)).toBe(nextState);

    const persistedStringState = await AsyncStorage.getItem("asyncstore");
    const persistedState = JSON.parse(persistedStringState);
    expect(persistedState).toStrictEqual(nextState);
  });
});
