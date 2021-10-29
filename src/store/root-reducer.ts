import { combineReducers } from "redux"
import { connectRouter } from "connected-react-router"
import { localeReducer } from "./locale"
import type { History } from "history"
import type { StateType, RootAction } from "typesafe-actions"

const rootReducer = (history: History) => {
    const appReducer = combineReducers({
        router: connectRouter(history),
        locale: localeReducer
    })

    return (state: StateType<typeof appReducer>, action: RootAction) => {
        return appReducer(state, action)
    }
}

export default rootReducer
