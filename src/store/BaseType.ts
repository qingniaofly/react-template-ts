export enum E_ASYNC_TYPES {
    REQUEST = "REQUEST",
    SUCCEED = "SUCCEED",
    FALIED = "FALIED",
    CANCEL = "CANCEL"
}

export default abstract class BaseTypes {
    protected abstract getPrefix(): string

    /**
     * @description:
     * @param {string} method: api method name
     * @param {boolean} withCancel: is with cancel action
     * @return:[string, string, string, string?]
     */
    public getAsyncActionConstants = (method: string, withCancel?: boolean) => {
        const prefix = this.getPrefix()
        const upperCaseStr = method.toUpperCase()

        const result: [string, string, string, string?] = [
            `${prefix}/API_${upperCaseStr}_${E_ASYNC_TYPES.REQUEST}`,
            `${prefix}/API_${upperCaseStr}_${E_ASYNC_TYPES.SUCCEED}`,
            `${prefix}/API_${upperCaseStr}_${E_ASYNC_TYPES.FALIED}`
        ]
        if (withCancel) {
            result.push(`${prefix}/API_${upperCaseStr}_${E_ASYNC_TYPES.CANCEL}`)
        }
        return result
    }
}
