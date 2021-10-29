import { useEffect, useCallback, useState } from "react"

interface IframeMsg {
    type: "INIT_ADMIN_USER"
    payload: { userId: number }
}
export const useIframe = () => {
    const [userData, setUerData] = useState<{ userId: number }>()
    const addMessageListener = useCallback((event: MessageEvent) => {
        const msg = event?.data as IframeMsg
        if (msg?.type === "INIT_ADMIN_USER") {
            setUerData(msg.payload)
        }
    }, [])

    useEffect(() => {
        //是否嵌套在iframe中
        if (window.self !== window.top) {
            // const msg = {
            //     type: "IS_IFRAME_MOUNTED",
            //     payload: true
            // }
            // window.parent.postMessage(msg, _env_.EAMS_OLD_HOST)
        }
    }, [])

    useEffect(() => {
        window.addEventListener("message", addMessageListener, false)
        return () => {
            window.removeEventListener("message", addMessageListener, false)
        }
    }, [addMessageListener])

    return {
        isInIframe: window.self !== window.top,
        userData
    }
}
