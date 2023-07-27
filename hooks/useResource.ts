import { DependencyList, useRef } from "react";

enum State {
  Initial,
  Pending,
  Resolved,
  Rejected,
}

export type Resource<T> = ReturnType<typeof Resource<T>>;

function Resource<T>(factory: () => Promise<T>) {
  let state: State = State.Initial;
  let value: any;

  return {
    read(): T {
      if (state === State.Initial) {
        value = factory();
        value.then(
          (val: any) => {
            state = State.Resolved;
            value = val;
          },
          (err: any) => {
            state = State.Rejected;
            value = err;
          }
        )
      }

      switch (state as State) {
        case State.Initial:
        case State.Pending:
        case State.Rejected:
          throw value; // promise or error
        case State.Resolved:
          return value;
      }
    },
  };
}

export function useResource<T>(factory: () => Promise<T>, deps: DependencyList) {
  return useRef(Resource<T>(factory)).current;
}
