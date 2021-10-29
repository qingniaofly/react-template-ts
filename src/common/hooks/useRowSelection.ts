import { useMemo, useCallback } from "react"
import type { TableRowSelection } from "antd/lib/table/interface"
import { useImmer } from "./useImmer"
import type { Draft } from "immer"

type Key = string | number
type Options<T> = TableRowSelection<T> & { selectedList?: T[] }

interface SelectedRow<T> {
    selectedRowKeys: Key[]
    selectedRows: T[]
}

export const useRowSelection = <T>(options?: Options<T>) => {
    const [selectedRow, onSetselectedRow] = useImmer<SelectedRow<T>>({
        selectedRowKeys: options?.selectedRowKeys ?? [],
        selectedRows: options?.selectedList ?? []
    })

    const rowSelection = useMemo(() => {
        return {
            columnWidth: "40px",
            ...options,
            selectedList: selectedRow.selectedRows,
            selectedRowKeys: selectedRow.selectedRowKeys,
            //eslint-disable-next-line
            onChange: (selectedRowKeys: Key[], selectedRows: T[]) => {
                onSetselectedRow((draft: Draft<SelectedRow<T>>) => {
                    draft.selectedRowKeys = selectedRowKeys
                    draft.selectedRows = selectedRows as Draft<T[]>
                })
                if (options?.onChange) {
                    options.onChange(selectedRowKeys, selectedRows)
                }
            }
        }
    }, [options, selectedRow])
    // 操作完取消选中
    const resetSelection = useCallback(() => {
        onSetselectedRow(draft => {
            draft.selectedRowKeys = []
            draft.selectedRows = []
        })
    }, [])

    return {
        rowSelection,
        selectedList: selectedRow.selectedRows,
        selectedRowKeys: selectedRow.selectedRowKeys,
        resetSelection
    }
}
