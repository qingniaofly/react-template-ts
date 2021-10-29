import { http } from "@/common/utils"

http.interceptors.request.use(config => {
    // 给请求的header加参数，会先执行
    return config
})

// 子应用单独处理业务
http.interceptors.response.use(
    response => {
        // const data = response.data
        // 处理错误信息
        return response
    },
    error => {
        // 处理异常
        return Promise.reject(error)
    }
)

export default http
