# react-svelte-stores

Truly Reactive Stores for React.
Inspired by [Svelte](https://svelte.dev/tutorial/writable-stores)

`npm i react-svelte-stores`

## Why?

- I really enjoy using Svelte for rapid prototyping. Svelte's stores, like most Svelte features, allow you to focus on features, not boilerplate.

- Gateway drug to Svelte, or a way for people who already love Svelte to write Svelte-like code in React.

- I wanted to use a state management library with persistence built-in. Use `persisted` (for localStorage) and `persistedAsync` (for AsyncStorage) to create a store that automatically serializes and rehydrates its state.

- I wanted to use Svelte stores with React Native and with TypeScript.

- No need for `Provider`, `mapStateToProps`, `mapDispatchToProps`, etc. Just plug your store into a react-svelte-stores hook and write a concise component that is a pure function of your store's state. "Dispatch actions" by calling your custom store object methods.

- [Less code, fewer bugs](https://blog.codinghorror.com/the-best-code-is-no-code-at-all/). Static-typing and unit-testability are cherries on top!

- \*When I'm ready to make a "final version"/"production quality" application, I reach for Redux and Redux Observable. Redux's debugging experience and predictabilty are unmatched. However, react-svelte-stores and vanilla RxJS make development so easy that I use them for all prototypes/PoCs.

## Usage

- react-svelte-stores are meant for applications that require shared state, but will never grow to need Redux or other more robust state management libraries. I would place it in between the React Context API and Redux in terms of power.

- I recommend using react-svelte-stores when you have a narrow and shallow state tree, or a wide and shallow state tree. When you have deep state trees and find yourself needing performance optimizations such as memoized selectors (compatible w/ react-svelte-stores), you should use Redux. React-Redux has a lot of performance benefits that react-svelte-stores will never match because I use it for prototyping.

## Examples

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

`useStoreState`

#### `useStoreState(store: IStore<T>): T`

`useSelectedStoreState`

#### `useSelectedStoreState(store: IStore<T>, selector: <T, R>(state: T) => R): R`

* Compatible with reselect

### Stores

#### Primitive

`writable`

`readable`

`persisted`

`persistedAsync`

#### Custom
