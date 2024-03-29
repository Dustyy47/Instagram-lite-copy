import { combineCallbacks } from 'helpers/combineCallbacks'
import { Validator } from 'hooks/validators/useValidator'
import { cloneElement, useEffect } from 'react'

interface ValidatedComponentProps {
    children: React.ReactElement
    validator: Validator
    isHiddenBeforeBlur?: boolean
    isHiddenPermanently?: boolean
    classNames?: {
        wrapper?: string
        validationMessage?: string
    }
}

export function ValidatedComponent({
    children,
    validator,
    isHiddenPermanently = false,
    isHiddenBeforeBlur = true,
    classNames,
}: ValidatedComponentProps) {
    function handleBlur() {
        validator?.setIsHidden(isHiddenPermanently)
    }

    function handleChange(value: string) {
        validator?.validate(value)
    }

    useEffect(() => {
        validator?.validate('')
        validator?.setIsHidden(isHiddenPermanently || isHiddenBeforeBlur)
    }, [])

    return (
        <div className={classNames?.wrapper}>
            {cloneElement(children, {
                onChange: combineCallbacks(children.props.onChange, handleChange),
                onBlur: combineCallbacks(children.props.onBlur, handleBlur),
            })}
        </div>
    )
}
