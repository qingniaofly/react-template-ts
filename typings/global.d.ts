// import * as _R from "ramda"
import _dayjs from "dayjs"

declare global {
    // const R = typeof _R
    const dayjs = _dayjs

    type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>

    /**
     * @description: 直接获取axios 返回对象类型
     */
    //eslint-disable-next-line
    type AxiosReturnType<T> = T extends (...args: any[]) => AxiosPromise<infer R> ? R : any

    //https://github.com/Microsoft/TypeScript/issues/30621
    //eslint-disable-next-line
    interface Array<T> {
        filter(fn: typeof Boolean): Array<Exclude<T, null | undefined | 0 | "">>
    }

    //prettier-ignore
    /* eslint-disable */
    /**
     * @description: 传入类本身，而不是类的实例
     */
    interface ClassOf<T> {
        new(...args: any[]): T
    }
    /* eslint-disable */
    type ExcludesFalse = <T>(x: T | false) => x is T

    const _env_: {
        readonly NODE_ENV: string
        readonly PUBLIC_URL: string
        readonly HTTPS: boolean
        readonly PUBLIC_HISTORY: string
    }
}
