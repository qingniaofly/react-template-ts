import { createStore } from "redux"
import rootReducer from "./root-reducer"
import { history } from "@/routes/createHistory"

const initialState = {}

// eslint-disable-next-line
const store = createStore(rootReducer(history) as any, initialState)

export default store
