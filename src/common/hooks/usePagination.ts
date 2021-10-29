import { useState, useMemo, useEffect } from "react"
import type { PaginationProps } from "antd/lib/pagination"

export const defaultPagination = {
    pageSize: process.env.EAMS_DEFAULT_PAGE_SIZE,
    current: 1,
    showSizeChanger: true
}

export const usePagination = (config: PaginationProps) => {
    const [pagination, setPagination] = useState({
        pageSize: config?.pageSize || defaultPagination.pageSize,
        current: config?.current || config.defaultCurrent || defaultPagination.current
    })

    useEffect(() => {
        if (
            config?.pageSize &&
            config?.current &&
            (config?.pageSize !== pagination.pageSize || config?.current !== pagination.current)
        ) {
            setPagination({
                pageSize: config?.pageSize ?? defaultPagination.pageSize,
                current: config?.current ?? defaultPagination.current
            })
        }
    }, [config, pagination])

    const paginationConfig = useMemo(() => {
        return {
            ...defaultPagination,
            ...config,
            showSizeChanger: config.showSizeChanger ?? defaultPagination.showSizeChanger,
            size: config.size || "default",
            pageSize: pagination.pageSize,
            current: pagination.current,
            onChange: (current: number, pageSize = defaultPagination.pageSize) => {
                if (config.onChange) {
                    config.onChange(current, pageSize)
                }
                setPagination({ pageSize, current })
            },
            onShowSizeChange: (current: number, pageSize = defaultPagination.pageSize) => {
                if (config.onChange) {
                    config.onChange(current, pageSize)
                }
                setPagination({ pageSize, current })
            }
        }
    }, [config, pagination])

    return paginationConfig
}
