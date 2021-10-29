import React, { useCallback } from "react"
import { Tooltip } from "antd"
import { tuple } from "antd/lib/_util/type"
import { useIntl } from "react-intl"
import type { TooltipPlacement } from "antd/lib/tooltip"

const trigger = tuple("hover", "focus", "click", "contextMenu")

interface ISallerTooltipOptions {
    placement: TooltipPlacement
    trigger?: typeof trigger[number] | typeof trigger
    key?: string | number
}

//用于测试合同下， 某些功能需要弹出联系销售的tips
export const useSallerTooltip = (options: ISallerTooltipOptions) => {
    const { placement = "top", trigger = "hover" } = options
    const { formatMessage: f } = useIntl()
    // const currentUser = useContext(CurrentUserContext)
    //如果是销售，测试合同也不会提示
    // const isTestConstract = useMemo(() => {
    //     return currentUser.getContractType() === E_CONTRACT_TYPE.TEST && !currentUser.isSaller
    // }, [currentUser])
    const isTestConstract = false

    const SallerToolTip = useCallback(
        (render: Record<"render", React.ReactElement | JSX.Element | React.ReactText>) => {
            let Component: React.ReactElement | JSX.Element | React.ReactText
            if (isTestConstract) {
                Component = React.createElement(
                    Tooltip,
                    {
                        title: f({ id: "Note.Vip.Title" }),
                        key: options.key,
                        overlay: f({ id: "Note.Vip.Title" }),
                        placement,
                        trigger
                    },
                    React.createElement("div", { className: "u-full-width" }, render.render)
                )
            } else {
                Component = render.render as React.ReactElement
            }
            return Component
        },
        [isTestConstract, options.key, placement, trigger]
    )

    return {
        isTestConstract,
        SallerToolTip
    }
}
