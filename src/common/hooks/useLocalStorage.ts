import { useEffect, useState } from "react"

export const useLocalStorage = <T>(key: string, initialValue?: T, raw?: boolean): [T, (value: T) => void] => {
    const [state, setState] = useState<T>(() => {
        try {
            const localStorageValue = localStorage.getItem(key)
            if (typeof localStorageValue !== "string") {
                localStorage.setItem(key, raw ? String(initialValue) : JSON.stringify(initialValue))
                return initialValue
            } else {
                return raw ? localStorageValue : JSON.parse(localStorageValue || "null")
            }
        } catch {
            return initialValue
        }
    })

    useEffect(() => {
        try {
            const serializedState = raw ? String(state) : JSON.stringify(state)
            localStorage.setItem(key, serializedState)
        } catch {
            // to do
        }
    })

    return [state, setState]
}
