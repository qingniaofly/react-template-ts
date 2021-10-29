import { useRef, useState } from "react"
import useConst from "./useConst"

interface UseBooleanCallback {
    setTrue: () => void
    setFalse: () => void
    toggle: () => void
}

/**
 * boolean类型 hook
 * @param initialState boolean
 *
 * 设置loading、visible等状态
 *
 * const [loading, { setTrue: setLoading, setFalse: setUnLoading }] = useBoolean(false)
 * const [visible, { toggle: toggleVisible }] = useBoolean(false)
 */

export default function useBoolean(initialState: boolean): [boolean, UseBooleanCallback] {
    const [value, setValue] = useState<boolean>(initialState)
    const valueRef = useRef(value)
    const setTrue = useConst(() => {
        return () => {
            setValue(true)
            valueRef.current = true
        }
    })
    const setFalse = useConst(() => {
        return () => {
            setValue(false)
            valueRef.current = false
        }
    })
    const toggle = useConst(() => {
        return () => {
            return valueRef.current ? setFalse() : setTrue()
        }
    })
    return [value, { setTrue, setFalse, toggle }]
}
