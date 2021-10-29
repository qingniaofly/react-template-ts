import dayjs from "dayjs"
import http from "./utils.axios"
import log from "./utils.log"
import { pickBy, identity } from "lodash"
import { IUtils } from "./types"

const utils = {
    http,
    log
} as IUtils

// 是否是开发环境
utils.isDev = () => {
    return _env_.NODE_ENV === "development"
}

utils.isIEBrowser = !!~window.navigator.userAgent.indexOf("MSIE")
//从手机号码中分离出countryCode, phoneNumber, 并对其格式化，去除空格和一些特殊字符
utils.transformPhone = phoneNumber => {
    //从phone-input-2 取出的电话号码都是这样的格式 +86 135 3334 2223
    const countryCode = phoneNumber.substr(0, phoneNumber.indexOf(" ")).replace(/\s/g, "")
    const phone = phoneNumber.substr(phoneNumber.indexOf(" ") + 1).replace(/\s/g, "")
    return [countryCode, phone]
}

//格式相对时间
utils.formatRelativeTime = (fr, dataTemplate) => time => {
    if (!time) return

    //相差时间
    const diffHour = dayjs(time).diff(dayjs(), "hour")
    const diffDay = dayjs(time).diff(dayjs(), "day")
    const diffYear = dayjs(time).diff(dayjs(), "year")

    if (diffYear < 0) {
        return dayjs(time).format(dataTemplate ?? "YYYY/MM/DD")
    } else if (diffDay < 0 && diffDay > -8) {
        //一周内
        return fr(diffDay, "day", { numeric: "auto" })
    } else if (diffHour <= 0 && diffHour > -24) {
        //24小时内
        return fr(diffHour, "hour", { numeric: "auto", style: "narrow" })
    } else {
        return dayjs(time).format(dataTemplate ?? "MM/DD")
    }
}

utils.enumKeysAsString = <TEnum>(theEnum: TEnum) => Object.keys(theEnum).filter(x => `${+x}` !== x) as [keyof TEnum]

/* 从url中分割出domain, pathname */
utils.splitDomainFromUrl = url => {
    const link = document.createElement("a")
    link.href = url
    const domain = link.hostname
    const pathName = url.substr(url.indexOf(domain) + domain.length)
    return [domain, pathName]
}

// utils.export = (fileName, blob) => {
//     if (typeof window.navigator.msSaveBlob !== "undefined") {
//         // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
//         window.navigator.msSaveBlob(blob, decodeURI(fileName))
//     } else {
//         // 创建新的URL并指向File对象或者Blob对象的地址
//         const blobURL = window.URL.createObjectURL(blob)
//         // 创建a标签，用于跳转至下载链接
//         const link = document.createElement("a")
//         link.href = blobURL

//         link.setAttribute("download", fileName)
//         // 兼容：某些浏览器不支持HTML5的download属性
//         if (typeof link.download === "undefined") {
//             link.setAttribute("target", "_blank")
//         }
//         document.body.appendChild(link)
//         link.click()
//         // 释放blob URL地址
//         setTimeout(() => {
//             document.body.removeChild(link)
//             window.URL.revokeObjectURL(blobURL)
//         }, 0)
//     }
// }
utils.downloadFileByLink = (url: string, name: string) => {
    try {
        const isDev = utils.isDev()
        const index = name.lastIndexOf(".")
        const type = name.slice(index)

        // fs的下载地址，转到新管理中心网关
        if (url.indexOf("/hddown") > -1) {
            url = url.slice(url.indexOf("/hddown"))
            const baseURL = isDev ? "" : "/eamsgateway"
            url = url.replace("/hddown", `${baseURL}/eams-ucfserver/hddown`)
        }

        // 下载图片
        if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(type)) {
            downloadImage(url, name)
            return
        }
        // 下载除去图片之外的文件
        downloadFile(url)
    } catch (e) {
        utils.log.danger(">>>>>> Error >>>>>>")
        //eslint-disable-next-line
        console.error(e)
    }
}

// 下载除去图片之外的文件
const downloadFile = (url: string) => {
    try {
        // 3、iframe
        const panel = document.createElement("div")
        panel.className = "iframe_download"
        panel.style.display = "none"
        console.log("iframe download") //eslint-disable-line

        const iframe = document.createElement("iframe")
        // iframe.setAttribute("name", "frmpopwin")
        panel.style.display = "none"
        panel.style.width = "0px"
        panel.style.height = "0px"
        iframe.src = url
        panel.appendChild(iframe)

        iframe.onload = () => {
            document.body.removeChild(panel)
        }

        panel.appendChild(iframe)
        document.body.appendChild(panel)

        // setTimeout(() => document.body.removeChild(panel), 200)
    } catch {
        //
    }
}

// 下载图片
function downloadImage(url: string, name: string) {
    try {
        downloadImageByCanvas(url, name, () => {
            // 失败就直接预览
            previewImage(url, name)
        })
    } catch {
        previewImage(url, name)
    }
}

// 通过预览方式来查看图片
const previewImage = (url: string, name: string) => {
    // 下载图片暂时用新窗口打来预览。
    const link = document.createElement("a")
    link.href = url
    link.download = name
    link.style.display = "none"
    //
    // const blob = new Blob([url])
    // link.href = URL.createObjectURL(blob)
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// 通过下把图片下载下来，写到canvas，再通过a标签下载。
// url不支持跨域的话，需要解决跨域问题。
const downloadImageByCanvas = (url: string, name: string, onerror?: () => void) => {
    try {
        // url = "http://pic.c-ctrip.com/VacationH5Pic/mice/wechat/ewm01.png"
        const image = document.createElement("img")
        // crossorigin 是HTML5中新增的<img>标签属性
        //　crossorigin属性有两个值可选：
        // anonymous:如果使用这个值的话就会在请求中的header中的带上origin属性，但请求不会带上cookie和其他的一些认证信息。
        // use-credentials:这个同时会在跨域请求中带上cookie和其他的一些认证信息。在使用这两个值时都需要server端在response的header中带上Access-Control-Allow-Credentials属性。可以通过server的配置文件来开启这个属性：server开启Access-Control-Allow-Credentials
        // 解决跨域 Canvas 污染问题
        // image.setAttribute("crossOrigin", "anonymous")
        image.setAttribute("crossOrigin", "Anonymous")
        const index = name.lastIndexOf(".")
        const type = name.slice(index + 1)
        image.onload = function () {
            const canvas = document.createElement("canvas")
            canvas.width = image.width
            canvas.height = image.height

            const context = canvas.getContext("2d") as CanvasRenderingContext2D
            context.drawImage(image, 0, 0, image.width, image.height)
            const url = canvas.toDataURL(`image/${type}`)
            // 生成一个a元素
            const a = document.createElement("a")
            // 创建一个单击事件
            const event = new MouseEvent("click")

            // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
            a.download = name
            // 将生成的URL设置为a.href属性
            a.href = url

            // 触发a的单击事件
            a.dispatchEvent(event)
        }
        image.onerror = () => {
            onerror && onerror()
        }
        image.src = url
    } catch {
        //
    }
}

utils.arraymove = (array, from, to) => {
    const arrayMutate = [...array]
    const startIndex = to < 0 ? array.length + to : to

    if (startIndex >= 0 && startIndex < array.length) {
        const item = arrayMutate.splice(from, 1)[0]
        arrayMutate.splice(startIndex, 0, item)
    }
    return arrayMutate
}

utils.cleanEmpty = target => {
    return pickBy(target, identity)
}

utils.copyData = value => {
    const textArea = document.createElement("textarea")
    textArea.value = value
    document.body.appendChild(textArea)
    textArea.select()
    const res = document.execCommand("Copy")
    document.body.removeChild(textArea)
    return res
}

export { http }
export default utils
