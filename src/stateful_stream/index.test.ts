import { StatefulStream } from ".";

describe("stateful stream", () => {
  const myStream = new StatefulStream(5);

  test("has initial state", () => {
    expect(myStream._getValue() === 5).toBe(true);
    expect(myStream._getValue() === 6).toBe(false);
  });

  test("updates values", () => {
    myStream.next(8);

    expect(myStream._getValue() === 8).toBe(true);
    expect(myStream._getValue() === 9).toBe(false);
  });

  test("can subscribe and unsubscribe", () => {
    const testStream = new StatefulStream(1);

    const streamedValues: Array<number> = [];

    const mySub = testStream.subscribe(value => streamedValues.push(value));

    expect(mySub.closed).toBe(false);

    testStream.next(2);
    testStream.next(3);

    mySub.unsubscribe();

    expect(mySub.closed).toBe(true);

    testStream.next(4);
    testStream.next(5);

    expect(streamedValues).toStrictEqual([1, 2, 3]);
  });
});
