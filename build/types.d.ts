import { Subscription } from "rxjs";
export declare type Selector<T, R> = (store: T) => R;
export declare type SubscriptionCallback<T> = (state: T) => void;
export interface IStore<T> {
    subscribe: (callback: SubscriptionCallback<T>) => Subscription;
}
export declare type UpdateFunction<T> = (state: T) => T;
export declare type AsyncUpdateFunction<T> = (state: T) => Promise<T>;
export interface IWritableStore<T> extends IStore<T> {
    update: (updateFunction: UpdateFunction<T>) => void;
    asyncUpdate: (updateFunction: AsyncUpdateFunction<T>) => void;
    set: (nextState: T) => void;
}
export interface IReadableStore<T> extends IStore<T> {
}
