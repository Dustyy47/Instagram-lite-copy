type SetStringStateCallback = (setValue: (value: string) => void) => void
type SetFileStateCallback = (setValue: (value: File) => void) => void

function isStringCb(cb: SetStringStateCallback | SetFileStateCallback): cb is SetStringStateCallback {
    return true
}

export function resetFormFields(...setStateCallbacks: (SetStringStateCallback | SetFileStateCallback)[]) {
    for (let setState of setStateCallbacks) {
        if (isStringCb(setState)) setState((state) => '')
        else setState((state) => undefined)
    }
}
