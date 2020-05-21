"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatefulStream {
    constructor(initalState) {
        this.value = initalState;
        this.subCount = 0;
        this.subscribers = new Map();
    }
    subscribe(callback) {
        const id = this.subCount;
        this.subscribers.set(id, callback);
        this.subCount++;
        callback(this.value);
        // close over reference to this.subscribers
        const removeSub = () => {
            this.subscribers.delete(id);
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
        this.subscribers.forEach(v => v(value));
    }
    /** for testing, or if you really need only the current value */
    _getValue() {
        return this.value;
    }
}
exports.StatefulStream = StatefulStream;
