/* eslint-disable */
interface IText {
    text: string
    type?: "primary" | "success" | "default" | "warning" | "danger"
}
export interface IUtilLog {
    capsule(title: string, info: string, type: string): void
    colorful(textArr: IText[]): void
    default(text: string): void
    success(text: string): void
    primary(text: string): void
    warning(text: string): void
    danger(text: string): void
}

const utilLog: IUtilLog = {} as any

/**
 * @description 返回这个样式的颜色值
 * @param {String} type 样式名称 [ primary | success | warning | danger | text ]
 */
function typeColor(type = "default") {
    let color = ""
    switch (type) {
        case "default":
            color = "#35495E"
            break
        case "primary":
            color = "#3488ff"
            break
        case "success":
            color = "#43B883"
            break
        case "warning":
            color = "#e6a23c"
            break
        case "danger":
            color = "#f56c6c"
            break
        default:
            break
    }
    return color
}

/**
 * @description 打印一个 [ title | text ] 样式的信息
 * @param {String} title title text
 * @param {String} info info text
 * @param {String} type style
 */
utilLog.capsule = function (title: string, info: string, type = "primary") {
    console.log(
        `%c ${title} %c ${info} %c`,
        "background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;",
        `background:${typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
        "background:transparent"
    )
}

/**
 * @description 打印彩色文字
 */
utilLog.colorful = function (textArr: IText[]) {
    console.log(`%c${textArr.map(t => t.text || "").join("%c")}`, ...textArr.map(t => `color: ${typeColor(t.type)};`))
}

/**
 * @description 打印 default 样式的文字
 */
utilLog.default = function (text: string) {
    utilLog.colorful([{ text }])
}

/**
 * @description 打印 primary 样式的文字
 */
utilLog.primary = function (text: string) {
    utilLog.colorful([{ text, type: "primary" }])
}

/**
 * @description 打印 success 样式的文字
 */
utilLog.success = function (text: string) {
    utilLog.colorful([{ text, type: "success" }])
}

/**
 * @description 打印 warning 样式的文字
 */
utilLog.warning = function (text: string) {
    utilLog.colorful([{ text, type: "warning" }])
}

/**
 * @description 打印 danger 样式的文字
 */
utilLog.danger = function (text: string) {
    utilLog.colorful([{ text, type: "danger" }])
}

export default utilLog
