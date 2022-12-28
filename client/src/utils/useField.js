import { useState } from 'react'

export function renderFields(fields) {}

export function useField(options) {
    const [value, setValue] = useState()
    return {
        ...options,
        value,
        setValue,
    }
}
