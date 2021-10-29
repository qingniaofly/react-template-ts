/* eslint-disable @typescript-eslint/naming-convention */
import zh_CN from "./zh_CN.json"
import en_US from "./en_Us.json"
import { createIntl, createIntlCache } from "react-intl"
import store from "@/store"
import zhCN from "antd/es/locale/zh_CN"
import enUS from "antd/es/locale/en_US"
import type { RootState } from "typesafe-actions"
import { Locale } from "antd/es/locale-provider"
import { zh_CN as base_zh_CN, en_US as base_en_US } from "@/common/translations"

const messages = {
    zh_CN: { ...base_zh_CN, ...zh_CN },
    en_US: { ...base_en_US, ...en_US }
}
const cache = createIntlCache()

export const intl = () => {
    const state = store.getState() as RootState
    const locale = state.locale
    if (locale.language === "en_US") {
        return createIntl(
            {
                locale: "en",
                messages: messages.en_US
            },
            cache
        )
    }

    return createIntl(
        {
            locale: "zh",
            messages: messages.zh_CN
        },
        cache
    )
}

export default messages
export type Messages = typeof messages
export type LanguageType = keyof typeof messages
export const antdLocale: Record<string, Locale> = {
    zh_CN: zhCN,
    en_US: enUS
}
