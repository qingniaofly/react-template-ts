import React, { memo } from "react"
import { hot } from "react-hot-loader/root"
import { IntlProvider } from "react-intl"
import { ConfigProvider } from "antd"
import Routes from "@/views/Routes"
import msgs, { antdLocale } from "@/translations"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "typesafe-actions"

const App = () => {
    const { language } = useSelector((state: RootState) => {
        return {
            language: state.locale.language || "zh_CN"
        }
    }, shallowEqual)

    language === "en_US" ? dayjs.locale("en") : dayjs.locale("zh-cn")
    const intlLocale = language.split("_")[0]
    const messages = (msgs as Record<string, unknown>)[language] as Record<string, string>
    return (
        <IntlProvider locale={intlLocale} messages={messages}>
            <ConfigProvider locale={antdLocale[language]}>
                <Routes />
            </ConfigProvider>
        </IntlProvider>
    )
}
export default hot(memo(App))
