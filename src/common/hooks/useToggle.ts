import { useState, useCallback } from "react"

export const useToggle = (defaultVisible = false) => {
    const [visible, setVisible] = useState(defaultVisible)

    const show = useCallback(() => setVisible(true), [])
    const hide = useCallback(() => setVisible(false), [])

    return [visible, show, hide] as [typeof visible, typeof show, typeof hide]
}
