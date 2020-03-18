# react-svelte-stores

Truly Reactive Stores for React.
Inspired by [Svelte](https://svelte.dev/tutorial/writable-stores)

`npm i react-svelte-stores`

## Why?

- I wanted a good set of primitives with which I could __build custom state management solutions__.

- I wanted a "cleaner" API than React's Context. 

- Gateway drug to Svelte, or a way for people who already love Svelte to write Svelte-like code in React.

## Recipes

### FSM Audio Player

You can use react-svelte-stores to create a finite state machine component that can receive messages from other components.

- The state enum or string union represents the vertices of a state diagram.
- The switch cases in the reducer function represent the edges of a state diagram; the transitions between states.
- Side effects are handled in `useEffect` 

`Player.tsx`
```typescript
import React, { FC, useEffect, useRef } from "react";
import {
  writable,
  useStoreState
} from "react-svelte-stores";

type State = {
  // possible states
  status: "loading" | "playing" | "paused";
  time: number;
};

// discriminated union of possible actions
type Action =
  | { type: "LOADED" }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "UPDATE_TIME"; time: number };

const reducer = (state: State, action: Action): State => {
  // state transitions based on state ("status") and event ("action")
  switch (state.status) {
    // when in the "loading" state, only react to "LOADED" action
    case "loading":
      switch (action.type) {
        case "LOADED":
          return {
            ...state,
            status: "playing"
          };

        default:
          return state;
      }
  
    // when in the "playing" state, react to "PAUSE" and "UPDATE_TIME" actions
    case "playing":
      switch (action.type) {
        case "PAUSE":
          return {
            ...state,
            status: "paused"
          };

        case "UPDATE_TIME":
          return {
            ...state,
            time: action.time
          };

        default:
          return state;
      }

    // when in the "paused" state, only react to "PLAY" action
    case "paused":
      switch (action.type) {
        case "PLAY":
          return {
            ...state,
            status: "playing"
          };

        default:
          return state;
      }
  }
};

const createReducibleStore = (
  initialState: State,
  reducer: (state: State, action: Action) => State
) => {
  const { subscribe, update } = writable(initialState);

  return {
    subscribe,
    dispatch: (action: Action) => update(state => reducer(state, action))
  };
};

const initialState: State = {
  status: "loading",
  time: 0
};

const playerFSM = createReducibleStore(initialState, reducer);

const Player: FC = () => {
  const playerState = useStoreState(playerFSM);

  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // side effects on state transitions
    if (playerState.status === "playing") {
      audio.current?.play();
    }

    if (playerState.status === "paused") {
      audio.current?.pause();
    }
  }, [playerState.status]);

  return (
    <div>
      <audio
        ref={audio}
        src=""
        onTimeUpdate={e =>
          playerFSM.dispatch({
            type: "UPDATE_TIME",
            time: e.currentTarget.currentTime
          })
        }
      />
      <p>Current Time: {playerState.time}</p>
      {(() => {
        switch (playerState.status) {
          case "loading":
            return <p>loading...</p>;

          case "playing":
            return (
              <button onClick={() => playerFSM.dispatch({ type: "PAUSE" })}>
                pause
              </button>
            );

          case "paused":
            return (
              <button onClick={() => playerFSM.dispatch({ type: "PLAY" })}>
                play
              </button>
            );
        }
      })()}
    </div>
  );
};
```
- Music applications commonly allow you to pause or play tracks from components other than the track player. We can do this by 
importing `playerFSM` and calling `playerFSM.dispatch`! 
- Because we need to know whether the player is playing or paused, we subscribe to the store state. In order to prevent unnecessary rerenders when the time is updated (we only care about the player status, not the time), we use `useSelectedStoreState`, which takes a selector function as its second argument. 

`OtherComponent.tsx`
```typescript
const OtherComponent: FC = () => {
  const playerStatus = useSelectedStoreState(playerFSM, state => state.status);

  switch (playerStatus) {
    case "loading":
      return null;

    case "playing":
      return (
        <button onClick={() => playerFSM.dispatch({ type: "PAUSE" })}>
          pause
        </button>
      );

    case "paused":
      return (
        <button onClick={() => playerFSM.dispatch({ type: "PLAY" })}>
          play
        </button>
      );
  }
};
```

This approach makes it (nearly?) impossible to reach impossible states, while making cross-component communication clean and easy. You can even dispatch actions without subscribing to the FSM store. This style of reducer function, which considers the previous state as well as the action, was inspired by [this David K. Piano tweet](https://twitter.com/davidkpiano/status/1171062893984526336?lang=en)

### Persisted Service


## API Reference

### Hooks

#### `useStoreState(store: IStore<T>): T`

#### `useSelectedStoreState(store: IStore<T>, selector: <T, R>(state: T) => R): R`

* Compatible with reselect

### Stores

#### `writable(initialState: T): IWritableStore<T>`

#### `readable(initialState: T, setCallback?: ReadableSetCallback<T>): IReadableStore<T>`

#### `persisted(initialState: T, storeKey: string, throttleMs?: number): IWritableStore<T>`

#### `persistedAsync(initialState: T, storeKey: string, AsyncStorage: AsyncStorageStatic, throttleMs?: number): IWritableStore<T>`

Custom stores must expose the subscribe function to be usable with hooks.
