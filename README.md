# typed-create

```ts
export const create = <T>(base: T) => {
  let state = base
  const api = {
    _setState<U>(newState: U | T): void {
      state = { ...state, ...newState } as T & U
    },
    setState(newState: T | Partial<T>): void {
      state = { ...state, ...newState }
    },
    getState(): T {
      return state
    }
  }

  return <U>(actions: (set: typeof api.setState, get: typeof api.getState) => U) => {
    api._setState({
      ...api,
      ...actions(api.setState, api.getState)
    })
    return {
      getState: api.getState,
      setState: api.setState
    } as _InternalCreateApi<T, U>
  }
}
```

In response to [this](https://stackoverflow.com/questions/70758462/how-to-infer-a-functions-parameter-type-from-its-return-type) question on stackoverflow


[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/scavdk)
