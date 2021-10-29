import axios from "axios"
import type { AxiosResponse } from "axios"
import { Subject } from "rxjs"
import { tap, map, debounceTime } from "rxjs/operators"
import utils from "./index"

interface AxiosInterceptorsError {
    response: AxiosResponse<unknown>
    errorMsg: string
}
export enum E_SESSIONSTORAGE_KEY {
    EAMS_TOKEN = "EAMS_TOKEN",
    EAMS_USER_ID = "EAMS_USER_ID"
}

export enum ERROR_CODE {
    LOGIN_THREE_TIMES = "MC00032",
    LOGIN_PWD_ERROR = "MC00015",
    VERIFY_CODE_ERROR = "USERVERIFY012",
    TEMPALTE_IMPORT_ERROR = "TEM00001",
    TEMPALTE_EMPTY_ERROR = "TEM00004",
    PAYMENT_ACCOUNT_ERROR = "cu00008",
    TOKEN_EXPIRED = "11000",
    TEMPALTE_LIMIT_ERROR = "TEM00041",
    FORBIDDEN = "403"
}

export const omitErrorMsg = [
    ERROR_CODE.LOGIN_THREE_TIMES,
    ERROR_CODE.VERIFY_CODE_ERROR,
    ERROR_CODE.TEMPALTE_IMPORT_ERROR,
    ERROR_CODE.TEMPALTE_EMPTY_ERROR,
    ERROR_CODE.TEMPALTE_LIMIT_ERROR
]

export const errorCreate$ = new Subject<AxiosInterceptorsError>()
errorCreate$
    .pipe(
        debounceTime(200),
        map(({ response, errorMsg }) => {
            const { url, baseURL } = response.config
            const originAPI = url?.replace(new RegExp(baseURL || ""), "").trim()
            return {
                status: response.status,
                api: originAPI,
                msg: errorMsg
            }
        }),
        tap(err => {
            // 打印到控制台
            if (process.env.NODE_ENV === "development") {
                utils.log.danger(">>>>>> Error >>>>>>")
                /* eslint-disable */
                console.group()
                console.error(`[status code]: ${err.status}`)
                console.error(`[api]: ${err.api}`)
                console.error(`[error message]: ${err.msg}`)
                console.groupEnd()
                /* eslint-enable */
            }
        })
        // distinct(err => err.msg)
    )
    .subscribe(({ msg }) => {
        console.error("error => ", msg) //eslint-disable-line
    })

// 创建一个 axios 实例
const service = axios.create({
    // baseURL: _env_.EAMS_API ?? process.env.EAMS_API
    // withCredentials: true
    // timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 在请求发送之前做一些处理
        const token = sessionStorage.getItem(E_SESSIONSTORAGE_KEY.EAMS_TOKEN),
            userId = sessionStorage.getItem(E_SESSIONSTORAGE_KEY.EAMS_USER_ID)

        if (token && token !== "undefined" && !config.url?.includes("/eams-gateway/getLoginUser")) {
            config.headers["EAMS-AUTH-TOKEN"] = token
        }

        if (token && token !== "undefined" && userId) {
            config.headers["x-client-token"] = token
            config.headers["x-client-token-user"] = JSON.stringify({ user: { id: userId } })
        }

        return config
    },
    error => {
        // 发送失败
        console.log(error) //eslint-disable-line
        Promise.reject(error)
    }
)

// 请求回调均不作处理，外面业务自己处理
service.interceptors.response.use(
    response => {
        const { config } = response
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data
        // 不拦截数据，直接返回
        if (config.headers && config.headers["intersepet-data"] === false) {
            return dataAxios
        }
        // 这个状态码是和后端约定的
        const { code, isSuccess } = dataAxios
        // token过期
        if (code === ERROR_CODE.TOKEN_EXPIRED) {
            return dataAxios
        }
        // 根据 code 进行判断
        if (code === undefined) {
            return dataAxios
        } else {
            // 有 code 代表这是一个后端接口 可以进行进一步的判断
            switch (+isSuccess) {
                case 0:
                    // 不成功
                    if (~omitErrorMsg.indexOf(code)) {
                        // 过滤不需要全局错误提示
                        return Promise.reject(new Error(code))
                    } else {
                        errorCreate$.next({ response, errorMsg: dataAxios.msg })
                        throw Error(dataAxios.msg)
                    }
                case 1:
                    // 成功
                    return dataAxios
                // token 过期
                case 5000:
                    // router.push({ name: "login" })
                    break
                default:
                    // 不是正确的 code
                    // errorCreate(response, dataAxios.message)
                    break
            }
        }
    },
    error => Promise.reject(error)
)

export default service
