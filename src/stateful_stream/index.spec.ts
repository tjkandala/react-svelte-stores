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

  test("multiple subscribers", () => {
    const dblStream = new StatefulStream(2);

    const firstStreamVals: Array<number> = [];
    const secondStreamVals: Array<number> = [];

    const firstSub = dblStream.subscribe(v => firstStreamVals.push(v));
    dblStream.next(4);
    const secondStream = dblStream.subscribe(v => secondStreamVals.push(v));
    dblStream.next(6);
    firstSub.unsubscribe();
    dblStream.next(8);
    dblStream.next(10);

    expect(firstStreamVals).toStrictEqual([2, 4, 6]);
    expect(secondStreamVals).toStrictEqual([4, 6, 8, 10]);
  });

  test("multiple subscribers, same callback", () => {
    const dblStream = new StatefulStream(2);

    const compositeStreamVals: Array<number> = [];

    const subCallback = (v: number) => compositeStreamVals.push(v);

    const firstSub = dblStream.subscribe(subCallback);
    dblStream.next(4);
    const secondStream = dblStream.subscribe(subCallback);
    dblStream.next(6);
    firstSub.unsubscribe();
    dblStream.next(8);
    dblStream.next(10);

    expect(compositeStreamVals).toStrictEqual([2, 4, 4, 6, 6, 8, 10]);
  });
});
