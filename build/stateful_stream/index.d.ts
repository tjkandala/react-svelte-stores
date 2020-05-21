export declare type StreamCallback<T> = (value: T) => void;
export declare type Subscription = {
    /** Destroys subscription to stateful stream */
    unsubscribe: () => void;
    /** have you unsubscribed/has the stream been closed */
    closed: boolean;
};
export declare class StatefulStream<T> {
    private value;
    /** subCount to derive id. don't decrement on unsub */
    private subCount;
    subscribers: Map<number, StreamCallback<T>>;
    constructor(initalState: T);
    subscribe(callback: StreamCallback<T>): Subscription;
    next(value: T): void;
    /** for testing, or if you really need only the current value */
    _getValue(): T;
}
