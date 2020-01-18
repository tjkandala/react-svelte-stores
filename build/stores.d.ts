import { IWritableStore, IReadableStore, IStore } from "./types";
import { AsyncStorageStatic } from "@react-native-community/async-storage";
/** Initializes a writable store */
export declare const writable: <T>(initialState: T) => IWritableStore<T>;
declare type SetFunction<T> = (nextState: T) => void;
declare type ReadableSetCallback<T> = (setFn: SetFunction<T>) => void;
/** Initializes a readable store */
export declare const readable: <T>(initialState: T, setCallback?: ReadableSetCallback<T>) => IReadableStore<T>;
declare type DeriveStateCallback<A, R> = (state: A) => R;
/** Initializes a derived store. Typically, you should just make a custom writable/persisted store and subscribe to slices of its state with selectors. */
export declare function derived<A, R>(store: IStore<A>, deriveStateCallback: DeriveStateCallback<A, R>): IReadableStore<R>;
interface IPersistedStore<T> extends IWritableStore<T> {
}
/** Initializes a persisted writable store. 0ms throttle by default. For use with localStorage */
export declare const persisted: <T>(initialState: T, storeKey: string, throttleMs?: number) => IPersistedStore<T>;
/** Initializes a persisted writable store. 0ms throttle by default. For use with AsyncStorage (React Native) */
export declare const persistedAsync: <T>(initialState: T, storeKey: string, AsyncStorage: AsyncStorageStatic, throttleMs?: number) => IPersistedStore<T>;
/** Get current value of a store without subscribing to it */
export declare const get: <T>(store: IStore<T>) => T;
/** Log your store's state changes over time, helpful for debugging */
export declare const log: <T>(name: string, store: IStore<T>) => void;
export {};
