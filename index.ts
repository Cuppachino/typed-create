const log = console.log;
console.clear();

// Types
export interface CreateApi<T> {
  getState: () => T;
  setState: (newState: T | Partial<T>) => T;
}

type _InternalCreateApi<T, U> = CreateApi<{
  [K in keyof T | keyof U]: K extends keyof T
    ? T[K]
    : K extends keyof U
    ? U[K]
    : never;
}> extends CreateApi<infer V>
  ? CreateApi<V>
  : never;

// Function
export const create = <T>(base: T) => {
  let state = base;
  const api = {
    _setState<U>(newState: U | T): void {
      state = { ...state, ...newState } as T & U;
    },
    setState(newState: T | Partial<T>): void {
      state = { ...state, ...newState };
    },
    getState(): T {
      return state;
    },
  };

  return <U>(
    actions: (set: typeof api.setState, get: typeof api.getState) => U
  ) => {
    api._setState({
      ...api,
      ...actions(api.setState, api.getState),
    });
    return {
      getState: api.getState,
      setState: api.setState,
    } as _InternalCreateApi<T, U>;
  };
};

// Example
const post = create({ upvotes: 0 })((set, get) => ({
  upvote: () =>
    set({
      upvotes: get().upvotes + 1,
    }),
}));

// Usage
const { upvote } = post.getState();
const resetUpvotes = () =>
  post.setState({
    upvotes: 0,
  });

log('init upvotes', post.getState().upvotes);

upvote();
log('+1');
upvote();
log('+1');

log('upvotes', post.getState().upvotes);

resetUpvotes();
log('reset!');

log('upvotes', post.getState().upvotes);
