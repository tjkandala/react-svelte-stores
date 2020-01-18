import { writable, readable, derived, persisted, get, log } from "./stores";
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

// TODO: Async story

// don't forget immutability!
// tell devs to normalize their data! trees plees!

// make a custom autocomplete store as an example! extend IStore!

// this is strongly-typed, not stringly-typed like redux!

// stores/store fns
export { writable, readable, derived, persisted, get, log };
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
