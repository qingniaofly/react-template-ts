import { combineReducers } from "redux"
import { createReducer } from "typesafe-actions"
import { setLanguage, setTestAction } from "./actions"
import type { ActionType } from "typesafe-actions"
import type { LanguageType } from "@/translations"
import produce from "immer"
import type { Draft } from "immer"

export type localeActions = ActionType<typeof setLanguage>

export type LocaleState = Readonly<{
    language: LanguageType
    test: string
}>

const defaultLocale = (localStorage.getItem("CURRENT_LANGUAGE") || "zh_CN") as LanguageType

const initialState: LocaleState = {
    language: defaultLocale ?? "zh_CN",
    test: ""
}

const language = createReducer(initialState.language).handleAction(
    [setLanguage],
    produce((draft: Draft<LanguageType>, action: ActionType<typeof setLanguage>) => {
        draft = action.payload
        localStorage.setItem("CURRENT_LANGUAGE", action.payload)
        return draft
    })
)
const test = createReducer(initialState.test).handleAction(
    [setTestAction],
    produce((draft: Draft<string>, action: ActionType<typeof setTestAction>) => {
        draft = action.payload
        return draft
    })
)
export default combineReducers({
    language,
    test
})
