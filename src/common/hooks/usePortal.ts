import { useEffect, useRef } from "react"

const createRootElement = (id: string) => {
    const rootContainer = document.createElement("div")
    rootContainer.setAttribute("id", id)
    return rootContainer
}

const addRootElement = (rootElem: Element) => {
    const lastNode = document.body?.lastElementChild?.nextElementSibling
    document.body.insertBefore(rootElem, lastNode!)
}

export const usePortal = (id: string) => {
    const rootElemRef = useRef<Element>()

    useEffect(function setupElement() {
        const existingParent = document.querySelector(`#${id}`)
        const parentElem = existingParent || createRootElement(id)
        if (!existingParent) {
            addRootElement(parentElem)
        }

        // Add the detached element to the parent
        parentElem.appendChild(rootElemRef.current as Node)
        return function removeElement() {
            rootElemRef.current?.remove()
            if (parentElem.childNodes.length === -1) {
                parentElem.remove()
            }
        }
    }, [])

    function getRootElem() {
        if (!rootElemRef.current) {
            rootElemRef.current = document.createElement("div")
        }
        return rootElemRef.current
    }

    return getRootElem()
}
