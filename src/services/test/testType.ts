// 获取客户企业存储空间统计
export interface StorageSpaceStats {
    recSpaceStats: string // 录制空间统计,默认为"0KB"
    fileSpaceStats: string // 文件空间统计,默认为"0KB"
    useSpaceStats: string // 已使用空间统计,默认为"0KB"
}
