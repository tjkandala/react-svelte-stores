"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const stores_1 = require("./stores");
/** State of a react-svelte-stores store */
exports.useStoreState = (store) => {
    const [state, setState] = react_1.useState(stores_1.get(store));
    react_1.useLayoutEffect(() => {
        const subscription = store.subscribe(state => setState(state));
        return () => subscription.unsubscribe();
    }, []);
    return state;
};
/** Selector to prevent unnecesary re-renders. Used when store value is not a primitive. Use memoized selectors if your selector involves expensive computations  */
exports.useSelectedStoreState = (store, selector, selectorDeps) => {
    const [state, setState] = react_1.useState(selector(stores_1.get(store)));
    const subRef = react_1.useRef(null);
    react_1.useLayoutEffect(() => {
        if (subRef.current) {
            subRef.current.unsubscribe();
        }
        if (selectorDeps) {
            setState(selector(stores_1.get(store)));
        }
        subRef.current = store.subscribe(state => setState(selector(state)));
        return () => subRef.current.unsubscribe();
    }, selectorDeps ? selectorDeps : []);
    return state;
};
