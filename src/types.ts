import { Subscription } from "./stateful_stream";

export type Selector<T, R> = (store: T) => R;

export type SubscriptionCallback<T> = (state: T) => void;

export interface IStore<T> {
  subscribe: (callback: SubscriptionCallback<T>) => Subscription;
}

export type UpdateFunction<T> = (state: T) => T;

export type AsyncUpdateFunction<T> = (state: T) => Promise<T>;

export interface IWritableStore<T> extends IStore<T> {
  update: (updateFunction: UpdateFunction<T>) => void;
  asyncUpdate: (updateFunction: AsyncUpdateFunction<T>) => void;
  set: (nextState: T) => void;
}

export interface IReadableStore<T> extends IStore<T> {}
