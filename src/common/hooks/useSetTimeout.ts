import { useEffect } from "react"
import useConst from "./useConst"

export default function useSetTimeout() {
    const timeoutMap = useConst(new Map<NodeJS.Timeout, number>())
    useEffect(() => {
        return () => {
            timeoutMap.forEach((...args) => {
                clearTimeout(args[1])
            })
        }
    }, [timeoutMap])
    return useConst({
        setTimeout: (fn: () => void, duration: number) => {
            const id = setTimeout(fn, duration)
            timeoutMap.set(id, 1)
            return id
        },
        clearTimeout: (id: NodeJS.Timeout) => {
            timeoutMap.delete(id)
            clearTimeout(id)
        }
    })
}
