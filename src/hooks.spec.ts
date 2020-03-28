import { useStoreState, useSelectedStoreState } from "./hooks";
import { renderHook, act } from "@testing-library/react-hooks";
import { writable, get } from "./stores";
import { createSelector } from "reselect";

interface ITodo {
  id: number;
  label: string;
}

interface ITodoState {
  todos: Array<ITodo>;
}

const firstTodo = { id: 1, label: "ball" };
const secondTodo = { id: 2, label: "post to reddit" };
const thirdTodo = { id: 3, label: "finish library" };

const todoState: ITodoState = {
  todos: [firstTodo, secondTodo, thirdTodo]
};

const funSelector = (state: ITodoState) =>
  state.todos.find(todo => (todo.id = 1));

describe("hooks", () => {
  test("work with primitive stores", () => {
    const store = writable(1);

    const { result } = renderHook(() => useStoreState(store));

    expect(result.current).toBe(1);

    act(() => {
      store.set(3);
      store.update(state => state + 2);
    });

    expect(result.current).toBe(5);
  });

  test("works with basic selectors", () => {
    const store = writable(todoState);

    const { result } = renderHook(() =>
      useSelectedStoreState(store, funSelector)
    );

    expect(result.current).toBe(firstTodo);
    expect(result.current).toStrictEqual({ id: 1, label: "ball" });

    store.update(state => ({
      ...state,
      todos: [...state.todos, { id: 4, label: "new todo" }]
    }));

    // make sure component won't rerender (referential equality)
    expect(result.current).toBe(firstTodo);
  });

  test("works with reselect", () => {
    const store = writable(todoState);

    const getLabelLength = createSelector(funSelector, todo =>
      todo.label.split("").reduce((acc, _) => {
        return acc + 1;
      }, 0)
    );

    const { result } = renderHook(() =>
      useSelectedStoreState(store, getLabelLength)
    );

    expect(result.current).toBe(4);
  });

  // TODO: Test selector deps. They are working in production, but
  // write a test to detect regressions
  // test("selector deps", () => {
  //   const store = writable(todoState)
  // })
});
