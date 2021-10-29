import { createAction } from "typesafe-actions"
import type { LanguageType } from "@/translations"

/**
 * @description: 切换语言
 * @param {string}
 * @return: PayloadAC<string, string>
 */
export const setLanguage = createAction("@@locale/CHANGE_LANGUAGE")<LanguageType>()

/**
 * @description: 测试
 * @param {string}
 * @return: PayloadAC<string, string>
 */
export const setTestAction = createAction("@@locale/TestAction")<string>()
