import { useState, useCallback, useMemo, useEffect } from "react"
import { cond, matches, constant, isNumber, identity, isEqual } from "lodash"
import { ReplaySubject, of, merge, timer, combineLatest, defer, BehaviorSubject, Observable, EMPTY } from "rxjs"
import {
    exhaustMap,
    switchMap,
    mergeMap,
    throttleTime,
    debounceTime,
    distinctUntilChanged,
    map,
    tap,
    retryWhen,
    catchError,
    scan,
    delay,
    mapTo,
    takeUntil,
    startWith,
    share,
    skip
} from "rxjs/operators"
// import nprogress from "nprogress"
import { useObservable, useSubscription } from "observable-hooks"
import { useConstant } from "./useConstant"
import type { AxiosResponse, AxiosError } from "axios"

interface IOptions<T = unknown> {
    service: (...param: any[]) => Promise<AxiosResponse<T> | T> | undefined
    debounce?: number
    throttle?: number
    retry?: number
    retryDelay?: number
    loadingDelay?: number
    race?: "switch" | "exhaust" | "merge"
    onSuccess?: (value: T) => void
    onError?: (error: AxiosError | null) => void
    quiet?: boolean
    autoQuery?: boolean
}

const getMapper = cond([
    [matches("exhaust"), constant(exhaustMap)],
    [matches("switch"), constant(switchMap)],
    [matches("merge"), constant(mergeMap)]
])

function isAxiosResponse<T>(resp: AxiosResponse<T> | T): resp is AxiosResponse {
    return (resp as AxiosResponse).data !== undefined
}

function isError(e: unknown) {
    return e instanceof Error
}

interface Response<T> {
    loading: boolean
    response?: T
}

const useHttpObservable = <T>(
    params$: Observable<unknown>,
    options: IOptions<T>,
    autoQuery: boolean,
    cancel$?: BehaviorSubject<boolean>
    // result$: Observable<T> = empty()
): [Observable<T>, Observable<boolean>] => {
    const {
        service,
        debounce,
        throttle,
        retry = 0,
        retryDelay = 1000,
        loadingDelay = 300,
        race = "switch",
        onSuccess,
        onError
    } = options

    const cancelFetch$ = cancel$ ? cancel$.pipe(skip(1)) : EMPTY
    const fetch$ = (...params: any[]) => {
        const http = async (...params: any[]) => {
            const data = await service(...params)
            if (!data) return Promise.reject()
            return isAxiosResponse(data) ? data.data : data
        }
        return defer(() => http(...params)).pipe(
            takeUntil(cancelFetch$),
            retryWhen(errors$ =>
                errors$.pipe(
                    scan((count, error) => {
                        if (count >= retry - 0) {
                            throw error
                        } else {
                            return count + 1
                        }
                    }, 0),
                    delay(retry > 0 ? retryDelay : 0)
                )
            ),
            catchError(error => {
                if (onError && (isError(error) || !error)) {
                    onError(error ?? "no value")
                }
                return of(error)
            })
        )
    }

    const response$ = useObservable<T>(() =>
        params$.pipe(
            isNumber(throttle) ? throttleTime(throttle) : map(identity),
            isNumber(debounce) ? debounceTime(debounce) : map(identity),
            autoQuery ? distinctUntilChanged(isEqual) : map(identity),
            getMapper(race)(params => fetch$(...(Array.isArray(params) ? params : [params]))),
            tap(value => (value !== undefined || value !== null) && onSuccess && !isError(value) && onSuccess(value)),
            share()
        )
    )

    const loading$ = useObservable<boolean>(() =>
        merge(
            combineLatest([params$, timer(loadingDelay).pipe(mapTo(true), takeUntil(response$))]).pipe(
                // tap(() => !quiet && nprogress.start()),
                mapTo(true)
            ),
            combineLatest([response$, timer(loadingDelay + 500)]).pipe(
                // tap(() => !quiet && nprogress.done()),
                mapTo(false)
            ),
            combineLatest([cancelFetch$]).pipe(
                // tap(() => !quiet && nprogress.done()),
                mapTo(false)
            )
        ).pipe(startWith(false), distinctUntilChanged())
    )

    return [response$, loading$]
}

export const useRxjsHttp = <T>(options: IOptions<T>, ...params: any[]) => {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<T>()
    const params$ = useConstant(() => new ReplaySubject(1))
    const [response$, loading$] = useHttpObservable<T>(params$, options, options.autoQuery ?? true)
    useEffect(() => params$.next(params), params)
    useSubscription(loading$, setLoading)
    useSubscription(response$, setResponse)

    return { response, loading }
}

export const useRxjsHttpObservable = <T>(options: IOptions<T>, params$: Observable<unknown>) => {
    return useHttpObservable<T>(params$, options, options.autoQuery ?? true)
}

export function useRxjsHttpCallBack<T>(
    options: IOptions<T>
): [(...args: any[]) => Promise<T>, Response<T>, VoidFunction?] {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<T>()
    const params$ = useConstant(() => new ReplaySubject(1))
    const cancel$ = useConstant(() => new BehaviorSubject<boolean>(false))
    const callback = useCallback((...params: any[]) => {
        params$.next(params)
        return new Promise<T>((resolve, reject) => {
            response$.subscribe(value => (value instanceof Error ? reject(value) : resolve(value)), reject)
        })
    }, [])
    const cancel = useCallback(() => cancel$.next(true), [cancel$])
    const opts = useMemo<IOptions<T>>(
        () => ({
            race: options.race || "exhaust",
            ...options
        }),
        [options]
    )
    const [response$, loading$] = useHttpObservable<T>(params$, opts, false, cancel$)
    useSubscription(loading$, setLoading)
    useSubscription(response$, setResponse)

    return [callback, { loading, response }, cancel]
}
