import { useEffect } from 'react'
function isNode(target: EventTarget | null): asserts target is Node {
    if (!target || !('nodeType' in target)) {
        throw new Error(`Node expected`)
    }
}

export function useOutsideClick(ref: React.RefObject<Element>, callback: () => any) {
    function handleClick(e: MouseEvent) {
        isNode(e.target)
        if (ref.current && !ref.current.contains(e.target)) {
            callback()
        }
    }

    useEffect(() => {
        document.body.addEventListener('mousedown', (e) => handleClick(e))

        return () => {
            document.body.removeEventListener('mousedown', handleClick)
        }
    }, [])
}
