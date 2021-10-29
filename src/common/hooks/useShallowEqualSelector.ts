import { useSelector as useReduxSelector, shallowEqual } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import type { RootState } from "typesafe-actions"

/**
 * @description: 重新定义selector的方法中state类型，这样我们在使用useSelector hook时，不用每次多要去定义state类型
 */
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export function useShallowEqualSelector<T extends unknown>(selector: (state: RootState) => T) {
    return useSelector(selector, shallowEqual)
}
