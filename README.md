# react-svelte-stores

Truly Reactive Stores for React.
Inspired by [Svelte](https://svelte.dev/tutorial/writable-stores)

`npm i react-svelte-stores`

## Why?

- I wanted a good set of primitives with which I could __build custom state management solutions__.

- I wanted a "cleaner" API than React's Context. 

- Gateway drug to Svelte, or a way for people who already love Svelte to write Svelte-like code in React.

## Examples

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
  status: "loading" | "playing" | "paused";
  time: number;
};

type Action =
  | { type: "LOADED" }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "UPDATE_TIME"; time: number };

const reducer = (state: State, action: Action): State => {
  switch (state.status) {
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

    default:
      return state;
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
