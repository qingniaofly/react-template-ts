import { useEffect, useState } from "react"

/**
 * key — sessionStorage 键来管理。
 * initialValue — 要设置的初始化值，如果sessionStorage中的值为空。
 * raw — boolean, 如果设为 true，钩子将不会尝试 JSON 序列化存储的值
 */
const useSessionStorage = <T>(key: string, ...args: [T?, boolean?]): [T, (value: T) => void] => {
    const [initialValue, raw] = args
    const [state, setState] = useState<T>(() => {
        try {
            const sessionStorageValue = sessionStorage.getItem(key)
            if (typeof sessionStorageValue !== "string") {
                sessionStorage.setItem(key, raw ? String(initialValue) : JSON.stringify(initialValue))
                return initialValue
            } else {
                return raw ? sessionStorageValue : JSON.parse(sessionStorageValue || "null")
            }
        } catch {
            return initialValue
        }
    })

    useEffect(() => {
        try {
            const serializedState = raw ? String(state) : JSON.stringify(state)
            if (serializedState) {
                sessionStorage.setItem(key, serializedState)
            }
        } catch {
            //some error
        }
    }, [state, key])

    return [state, setState]
}

export default useSessionStorage
