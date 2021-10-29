/*
 * @Date: 2020-06-10 17:34:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-12-28 11:31:01
 */
import type { IntlFormatters } from "react-intl"
import type { ConfigType } from "dayjs"
import type { AxiosInstance } from "axios"
import type { Dictionary } from "lodash"
import type { IUtilLog } from "./utils.log"

export interface IUtils {
    readonly http: AxiosInstance
    readonly log: IUtilLog

    isDev(): boolean

    /* 当前是不是用户使用的是不是ie浏览器 */
    isIEBrowser: boolean
    /**
     * @description: 由于typescript中的enum是运行时计算的，而且编辑完的代码比较大，特别是对于动态的string, 并不是很好的支持
     * 而tuple并不是在运行期间获取类型，而是在编译期间
     * 详细用法：https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
     * @return: string[]
     */
    tuple<T extends string[]>(...args: T): T

    tupleNum<T extends number[]>(...args: T): T

    /**
     * @description: 从手机号码中分离出countryCode, phoneNumber, 并对其格式化，去除空格和一些特殊字符
     * @param {string} 电话号码
     * @return: [countryCode: string, phone: string]
     */
    transformPhone(phoneNumber: string): [string, string]

    /**
     * @description: 通过intl formatRelativeTime方法来格式相对时间(前一天， 明天，今天。。)
     * @param fr: IntlFormatters React intl 相对时间方法
     * @return: string | undefind
     */
    formatRelativeTime(
        fr: IntlFormatters["formatRelativeTime"],
        dataTemplate?: string
    ): (time: ConfigType) => string | undefined

    /**
     * @description: 获取的enum的所有key
     * @param enums 杖举对象
     * @return string[]
     */
    enumKeysAsString<T>(enums: T): [keyof T]

    /**
     * @description: 从url中分割出domain, pathname
     * @param {string} url
     * @return:[domain, pathname]
     */
    splitDomainFromUrl(url: string): [string, string]

    /**
     * @description: 导出文件
     * @param {Blob} blob
     */
    export(fileName: string, blob: Blob): void

    /**
     * @description: 下载文件
     * @param {string} url 文件地址url
     */
    downloadFileByLink(url: string, name: string): void

    /**
     * @description: 清除对象空值属性
     * @param {Record<string, any>}target
     * @return:Dictionary<T>
     */
    cleanEmpty<T extends Record<string, any>>(target: T): Dictionary<T> //eslint-disable-line
    /**
     * @description:
     * @param array - The array with the item to move.
     * @param from - Index of item to move. If negative, it will begin that many elements from the end.
     * @param to - Index of where to move the item. If negative, it will begin that many elements from the end.
     * @returns A new array with the item moved to the new position.
     *
     * @example
        ```
        import arrayMove = require('array-move');
        const input = ['a', 'b', 'c'];
        const array1 = arrayMove(input, 1, 2);
        console.log(array1);
        //=> ['a', 'c', 'b']
        const array2 = arrayMove(input, -1, 0);
        console.log(array2);
        //=> ['c', 'a', 'b']
        const array3 = arrayMove(input, -2, -3);
        console.log(array3);
        //=> ['b', 'a', 'c']
        ```
     */
    arraymove<ValueType>(array: ReadonlyArray<ValueType>, from: number, to: number): ValueType[]
    copyData(value: string): void
}
