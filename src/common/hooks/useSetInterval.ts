import { useEffect } from "react"
import useConst from "./useConst"

export default function useSetInterval() {
    const timeoutMap = useConst(new Map<NodeJS.Timeout, number>())
    useEffect(() => {
        return () => {
            timeoutMap.forEach((...args) => {
                clearInterval(args[1])
            })
        }
    }, [timeoutMap])
    return useConst({
        setInterval: (fn: () => void, duration: number) => {
            const id = setInterval(fn, duration)
            timeoutMap.set(id, 1)
            return id
        },
        clearTimeout: (id: NodeJS.Timeout) => {
            timeoutMap.delete(id)
            clearInterval(id)
        }
    })
}
