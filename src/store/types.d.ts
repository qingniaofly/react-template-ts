import { StateType, ActionType } from "typesafe-actions"

declare module "typesafe-actions" {
    export type Store = StateType<typeof import("./index").default>
    export type RootAction = ActionType<typeof import("./root-action").default>
    export type RootState = StateType<ReturnType<typeof import("./root-reducer").default>>
    /**
     * We can extend internal types of typesafe-actions module with RootAction definition of our application
     * so that you don't need to pass generic type arguments with createReducer API
     * // now you can use
     * createReducer(...)
     * // instead of
     * createReducer<State, Action>(...)
     * */
    interface Types {/* eslint-disable-line */
        RootAction: ActionType<typeof import("./root-action").default>
    }
}
