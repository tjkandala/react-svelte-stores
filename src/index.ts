import {
  writable,
  readable,
  derived,
  persisted,
  persistedAsync,
  get,
  log
} from "./stores";
import { useStoreState, useSelectedStoreState } from "./hooks";
import {
  Selector,
  SubscriptionCallback,
  IStore,
  IWritableStore,
  IReadableStore,
  UpdateFunction,
  AsyncUpdateFunction
} from "./types";

// TODO: Fix JSDoc for object methods!

// stores/store fns
export { writable, readable, derived, persisted, persistedAsync, get, log };
// hooks
export { useStoreState, useSelectedStoreState };
//types
export {
  Selector,
  SubscriptionCallback,
  IStore,
  IWritableStore,
  IReadableStore,
  UpdateFunction,
  AsyncUpdateFunction
};
