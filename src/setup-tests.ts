var MockAsyncStorage = require("mock-async-storage");

// console.log(MockAsyncStorage.default);

const mockImpl = new MockAsyncStorage.default();
jest.mock("@react-native-community/async-storage", () => mockImpl);
