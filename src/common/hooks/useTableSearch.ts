import { pluckFirst, useObservable, useObservableState } from "observable-hooks"
import { debounceTime, map, tap, withLatestFrom } from "rxjs/operators"
import { useImmer, usePagination, useRxjsHttp } from "."
import type { AxiosResponse } from "axios"
import { useIntl } from "react-intl"
import { isEmpty } from "lodash"
import { useCallback, useRef } from "react"
export interface IPagination {
    //页条数
    pageNum: number
    //页条数
    pageSize: number
    //总条数
    total: number
    //总页数
    pages: number
}

export type PageSearchParam = Pick<IPagination, "pageNum" | "pageSize">

export const useTableSearchCriteria = <
    ServiceReturnType extends IPagination = IPagination,
    SearchCreteriaType extends Partial<PageSearchParam> = PageSearchParam
>(
    api: (...params: any[]) => Promise<AxiosResponse<ServiceReturnType> | ServiceReturnType> | undefined,
    conditions?: SearchCreteriaType
) => {
    const { formatMessage: f } = useIntl()
    const [paginationState, setPaginationState] = useImmer({
        pageSize: 20,
        current: 1,
        total: 0
    })
    const preSearchParam = useRef<Partial<SearchCreteriaType>>({
        pageNum: paginationState.current,
        pageSize: paginationState.pageSize
    } as SearchCreteriaType)

    const searchParams$ = useObservable(pluckFirst, [preSearchParam.current])
    const [searchCondition, onSearch] = useObservableState<SearchCreteriaType, Partial<SearchCreteriaType> | undefined>(
        (search$, initCondition) =>
            search$.pipe(
                // distinctUntilChanged(isEqual),
                debounceTime(200),
                tap(param => {
                    if (!isEmpty(param)) preSearchParam.current = param!
                }),
                withLatestFrom(searchParams$),
                map(([current, pre]) => ({ ...initCondition, ...(current ? current : pre) }))
            ),
        {
            pageNum: paginationState.current,
            pageSize: paginationState.pageSize,
            ...(conditions ? conditions : "")
        } as SearchCreteriaType
    )

    const { response, loading } = useRxjsHttp<ServiceReturnType>(
        {
            service: api,
            loadingDelay: 200,
            autoQuery: false,
            onSuccess: value => {
                setPaginationState(draft => {
                    if (!value) return draft
                    draft.current = value.pageNum
                    draft.total = value.total
                    draft.pageSize = value.pageSize
                })
            }
        },
        searchCondition
    )

    const pagination = usePagination({
        showTotal: total => f({ id: "Common.Page.Total" }, { num: total }),
        pageSize: paginationState.pageSize,
        current: paginationState.current,
        total: paginationState.total,
        onChange: (current: number, pageSize?: number) => {
            const params = {
                ...searchCondition,
                pageNum: current,
                pageSize: pageSize
            } as Partial<SearchCreteriaType>
            onSearch(params)
        }
    })

    const callback = useCallback((params?: Partial<SearchCreteriaType>) => onSearch(params), [onSearch])

    return [callback, { data: response, loading, pagination }] as const
}
