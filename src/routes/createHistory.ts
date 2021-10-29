import { createBrowserHistory, History, createHashHistory } from "history"

class ReactHistory {
    private static instance: History | null

    public static getInstance() {
        const isHashBrower = _env_.PUBLIC_HISTORY === "hash" ? true : false
        if (!ReactHistory.instance) {
            ReactHistory.instance = ReactHistory.create(isHashBrower)
        }
        return ReactHistory.instance
    }

    public static destory() {
        ReactHistory.instance = null
    }

    public static create(isHashBrower = false) {
        const basename = _env_.PUBLIC_URL
        const history = isHashBrower ? createHashHistory({ basename }) : createBrowserHistory({ basename })
        return history
    }
}

export const history = ReactHistory.getInstance()

export default ReactHistory
