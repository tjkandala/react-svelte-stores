"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
if (typeof localStorage === "undefined" || localStorage === null) {
    var localStorage = require("localStorage");
}
/** Initializes a writable store */
exports.writable = (initialState) => {
    const store = new rxjs_1.BehaviorSubject(initialState);
    return {
        subscribe: callback => store.subscribe(callback),
        /** Pass the update method a callback to update the store */
        update: updateFunction => {
            const nextState = updateFunction(store.value);
            store.next(nextState);
        },
        asyncUpdate: (updateFunction) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const updatePromise = updateFunction(store.value);
                const nextState = yield updatePromise;
                store.next(nextState);
            }
            catch (err) {
                console.error(err);
            }
        }),
        set: nextState => store.next(nextState)
    };
};
/** Initializes a readable store */
exports.readable = (initialState, setCallback) => {
    const store = new rxjs_1.BehaviorSubject(initialState);
    const setFn = nextState => store.next(nextState);
    if (setCallback) {
        setCallback(setFn);
    }
    return {
        subscribe: callback => store.subscribe(callback)
    };
};
/** Initializes a derived store. Typically, you should just make a custom writable/persisted store and subscribe to slices of its state with selectors. */
function derived(store, deriveStateCallback) {
    const { subscribe, set } = exports.writable(deriveStateCallback(exports.get(store)));
    store.subscribe(state => {
        set(deriveStateCallback(state));
    });
    return {
        subscribe
    };
}
exports.derived = derived;
/** Initializes a persisted writable store. 0ms throttle by default. For use with localStorage */
exports.persisted = (initialState, storeKey, throttleMs = 0) => {
    const persistedStateString = localStorage.getItem(storeKey);
    let persistedState;
    if (persistedStateString) {
        persistedState = JSON.parse(persistedStateString);
    }
    else {
        persistedState = null;
    }
    const { subscribe, update, asyncUpdate, set } = exports.writable(persistedState ? persistedState : initialState);
    const persistor$ = new rxjs_1.Subject();
    subscribe(state => persistor$.next(state));
    persistor$
        .pipe(operators_1.throttleTime(throttleMs))
        .subscribe(state => localStorage.setItem(storeKey, JSON.stringify(state)));
    return {
        subscribe,
        update,
        asyncUpdate,
        set
    };
};
/** Initializes a persisted writable store. 0ms throttle by default. For use with AsyncStorage (React Native) */
exports.persistedAsync = (initialState, storeKey, AsyncStorage, throttleMs = 0) => {
    const { subscribe, update, asyncUpdate, set } = exports.writable(initialState);
    // console.log("1");
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // console.log("2");
        const persistedStateString = yield AsyncStorage.getItem(storeKey);
        // console.log("4");
        if (persistedStateString) {
            const persistedState = JSON.parse(persistedStateString);
            set(persistedState);
        }
    }))();
    // console.log("3");
    const persistor$ = new rxjs_1.Subject();
    subscribe(state => persistor$.next(state));
    persistor$.pipe(operators_1.throttleTime(throttleMs)).subscribe((state) => __awaiter(void 0, void 0, void 0, function* () {
        yield AsyncStorage.setItem(storeKey, JSON.stringify(state));
    }));
    return {
        subscribe,
        update,
        asyncUpdate,
        set
    };
};
/** Get current value of a store without subscribing to it */
exports.get = (store) => {
    let value;
    store.subscribe(state => (value = state)).unsubscribe();
    return value;
};
/** Log your store's state changes over time, helpful for debugging */
exports.log = (name, store) => {
    store.subscribe(state => {
        console.log({
            store: name,
            state: state
        });
    });
};
