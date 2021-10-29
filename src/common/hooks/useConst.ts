import { isFunction } from "lodash"
import { useRef } from "react"
/**
 * 常量hook
 *
 * @param initialValue
 *
 * const a = useConst("hello")
 * const a = useConst(() => console.log("hello"))
 */
export default function useConst<T>(initialValue: T | (() => T)): T {
    const ref = useRef<{ value: T }>()
    if (ref.current === undefined) {
        ref.current = {
            value: isFunction(initialValue) ? initialValue() : initialValue
        }
    }
    return ref.current.value
}
