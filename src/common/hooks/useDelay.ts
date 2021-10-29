import { useLayoutEffect, useState } from "react"

/*
 * 解决闪现问题
 */
export const useDelay = (delay = 300) => {
    const [isStartToRender, setIsStartToRender] = useState<boolean>(false)

    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            setIsStartToRender(true)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [delay])

    return isStartToRender
}
