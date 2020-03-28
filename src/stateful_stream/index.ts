export type StreamCallback<T> = (value: T) => void;

export type Subscription = {
  /** Destroys subscription to stateful stream */
  unsubscribe: () => void;
  /** have you unsubscribed/has the stream been closed */
  closed: boolean;
};

export class StatefulStream<T> {
  private value: T;
  // using Map for O(1) unsubscription
  subscribers: Map<StreamCallback<T>, boolean>;

  constructor(initalState: T) {
    this.value = initalState;
    this.subscribers = new Map();
  }

  subscribe(callback: StreamCallback<T>): Subscription {
    this.subscribers.set(callback, true);

    callback(this.value);

    // close over reference to this.subscribers
    const removeSub = (): void => {
      this.subscribers.delete(callback);
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
    this.subscribers.forEach((_, k) => k(value));
  }

  /** for testing, or if you really need only the current value */
  _getValue(): T {
    return this.value;
  }
}
