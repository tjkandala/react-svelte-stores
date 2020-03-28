export type StreamCallback<T> = (value: T) => void;

export type Subscription = {
  /** Destroys subscription to stateful stream */
  unsubscribe: () => void;
  /** have you unsubscribed/has the stream been closed */
  closed: boolean;
};

export class StatefulStream<T> {
  private value: T;
  /** subCount to derive id. don't decrement on unsub */
  private subCount: number;
  // using Map for O(1) unsubscription. need id tho.
  subscribers: Map<number, StreamCallback<T>>;

  constructor(initalState: T) {
    this.value = initalState;
    this.subCount = 0;
    this.subscribers = new Map();
  }

  subscribe(callback: StreamCallback<T>): Subscription {
    const id = this.subCount;

    this.subscribers.set(id, callback);

    this.subCount++;

    callback(this.value);

    // close over reference to this.subscribers
    const removeSub = (): void => {
      this.subscribers.delete(id);
    };

    return {
      unsubscribe(): void {
        removeSub();
        this.closed = true;
      },
      closed: false
    };
  }

  next(value: T): void {
    this.value = value;
    this.subscribers.forEach(v => v(value));
  }

  /** for testing, or if you really need only the current value */
  _getValue(): T {
    return this.value;
  }
}
