import React from "react"
import ReactDOM from "react-dom"
import { ConnectedRouter } from "connected-react-router"
import "@/common/scss/global.scss"
import "nprogress/nprogress.css"
import "react-phone-input-2/lib/style.css"
import { enableMapSet, enableES5 } from "immer"
import "@formatjs/intl-relativetimeformat/polyfill"
import "@formatjs/intl-relativetimeformat/dist/locale-data/en"
import "@formatjs/intl-relativetimeformat/dist/locale-data/zh"
import "url-search-params-polyfill"
import "dayjs/locale/zh-cn"
import { Provider } from "react-redux"
import { history } from "@/routes/createHistory"
import store from "@/store"
import App from "./App"

//兼容ie
enableES5()
//开启immer支持es6 map set特性
enableMapSet()

const render = (Component: React.FC): void => {
    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Component />
            </ConnectedRouter>
        </Provider>,
        document.getElementById("app")
    )
}

render(App)
