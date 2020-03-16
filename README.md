# react-svelte-stores

Truly Reactive Stores for React.
Inspired by [Svelte](https://svelte.dev/tutorial/writable-stores)

`npm i react-svelte-stores`

## Why?

- After I started using [statecharts](https://statecharts.github.io/) to manage complex state instead of Redux, I needed to different way to communicate between distant components without prop-drilling. 

- Gateway drug to Svelte, or a way for people who already love Svelte to write Svelte-like code in React.

- I wanted to use a state management library with persistence built-in. Use `persisted` (for localStorage) and `persistedAsync` (for AsyncStorage) to create a store that automatically serializes and rehydrates its state.

- I wanted to use Svelte stores with React Native and with TypeScript.

- I wanted a "cleaner" API than React's Context. 

## Usage

(TODO: When to use RSS)

## Examples

(TODO: a more straightforward example. Explain how RSS works and why it is conducive to simpler code. Use persisted store with memoized selectors to demonstrate built in power)

### Easy React Native Autocomplete Search

`src/components/searchInput`
```ts
import React, { FC } from 'react'
import { View, Text, TextInput } from 'react-native'
import { searchStore } from '../stores/searchStore'


const SearchInput: FC = () => {
  const searchTerm = useSelectedStoreState(searchStore, state => state.searchTerm);

  return (
    <View>
      <TextInput
        placeholder="search"
        value={searchTerm}
        onChangeText={searchStore.setSearchTerm}
      />
    </View>
  );
}
```

`src/components/searchResults`
```ts
import React, { FC } from 'react'
import { View, FlatList } from 'react-native'
import { searchStore } from '../stores/searchStore'

const SearchResults: FC = () => {
  const searchResults = useSelectedStoreState(searchStore, state => state.searchResults);
  
  return (
    <FlatList
      data={searchResults}
      keyExtractor={item => item.id}
      renderItem={({item}) => <YourItemComponent item={item} />}
    />
  );
}
```

`src/stores/searchStore`
```ts
import { persistedAsync } from 'react-svelte-stores';
import { AsyncStorage } from 'react-native';

interface ISearchStoreState {
  searchTerm: string;
  loading: boolean;
  searchResults: Array<SearchResult>
}

const defaultSearchStoreState = {
  searchTerm: "",
  loading: false,
  searchResults:[]
};

const createSearchStore = (initialState: ISearchStoreState) => {
  const { subscribe, update, set } = persistedAsync(
    initialState,
    "@yourApp/searchStore",
    AsyncStorage
  );

  const searchTerm$: Subject<string> = new Subject();
  const autocomplete$ = searchTerm$.pipe(
    filter(searchTerm => searchTerm.length > 0),
    debounceTime(700),
    distinctUntilChanged(),
    switchMap(searchTerm =>
      ajax.getJSON(`https://yourSearchApiHere.com/${searchTerm}`).pipe(
        catchError(err => {
          console.log(err);
          return of(err);
        })
      )
    )
  );

  autocomplete$.subscribe((response: Array<SearchResult>) => update(state => ({
    ...state,
    loading: false
    searchResults: response
  }));

  return {
    subscribe,
    setSearchTerm: (searchTerm: string) => {
      update(state => ({
        ...state,
        loading: searchTerm.length ? true : false,
        searchTerm
      }));
      searchTerm$.next(searchTerm);
    }
  };
};

export const searchStore = createSearchStore(defaultSearchStoreState);
```

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
