"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatefulStream {
    constructor(initalState) {
        this.value = initalState;
        this.subscribers = new Map();
    }
    subscribe(callback) {
        this.subscribers.set(callback, true);
        callback(this.value);
        // close over reference to this.subscribers
        const removeSub = () => {
            this.subscribers.delete(callback);
        };
        return {
            unsubscribe() {
                removeSub();
                this.closed = true;
            },
            closed: false
        };
    }
    next(value) {
        this.value = value;
        this.subscribers.forEach((_, k) => k(value));
    }
    /** for testing, or if you really need only the current value */
    _getValue() {
        return this.value;
    }
}
exports.StatefulStream = StatefulStream;
