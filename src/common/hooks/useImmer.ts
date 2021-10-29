import produce from "immer"
import { useState, useCallback } from "react"
import type { Draft } from "immer"

export type Reducer<S = unknown, A = unknown> = (draftState: Draft<S>, action: A) => void | S

export function useImmer<S = unknown>(initialValue: S | (() => S)): [S, (f: (draft: Draft<S>) => void | S) => void]
export function useImmer(initialValue: unknown) {
    const [val, updateValue] = useState(initialValue)
    return [val, useCallback(updater => updateValue(produce(updater)), [])]
}

// export type useImmerReducer = <S = unknown, A = unknown>(
//     reducer: Reducer<S, A>,
//     initialState: S,
//     initialAction?: (initial: unknown) => S
// ) => [S, React.Dispatch<A>]
// export const useImmerReducer: useImmerReducer = (reducer, initialState, initialAction) => {
//     const cachedReducer = useCallback(produce(reducer), [reducer])
//     return useReducer(cachedReducer, initialState, initialAction)
// }
