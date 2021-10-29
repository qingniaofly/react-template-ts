import React, { memo, useCallback, useEffect } from "react"
import classnames from "classnames/bind"
import style from "./index.module.scss"
import { useIntl } from "react-intl"
const cx = classnames.bind(style)
const demoClass = cx("demo")
// import api from "@/services"
import { useHistory } from "react-router"
import store from "@/store"
import { setTestAction } from "@/store/locale/actions"
import { useSelector } from "react-redux"
import { RootState } from "typesafe-actions"
// const testServer = api.test

const Demo = () => {
    const history = useHistory()
    const { formatMessage: f } = useIntl()
    const { test } = useSelector((store: RootState) => {
        return store.locale
    })
    useEffect(() => {
        // testServer.getStorageSpaceStats().then(d => {
        //     // eslint-disable-next-line
        //     console.log(d)
        // })
    }, [])
    const onTestAction = useCallback(() => {
        //
        store.dispatch(setTestAction("hahhah"))
    }, [])
    return (
        <section className={demoClass}>
            <div>I am container -{f({ id: "Test" })}</div>
            <span onClick={() => history.push("/demo/test")}>测试路由</span>
            <span
                onClick={() => {
                    onTestAction()
                }}
            >
                测试action {test}
            </span>
        </section>
    )
}

export default memo(Demo)
