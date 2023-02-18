import { memo, useEffect } from 'react'
import { Validator } from '../../hooks/validators/useValidator'
import { AnyFunction } from '../../models/CallbacksTypes'
import { ValidationMessage } from '../ValidationMessage/ValidationMessage'
import styles from './Input.module.scss'

//TODO CLEAR STYLES PROPS
interface InputProps {
    onChange: (value: string) => any
    value?: string
    name?: string
    type?: string
    placeholder?: string
    isColumn?: boolean
    validator?: Validator
    forwardRef?: React.MutableRefObject<HTMLInputElement>
    onBlur?: AnyFunction
    isHiddenBeforeBlur?: boolean
    isHiddenPermanently?: boolean
    children?: React.ReactElement
    id?: string
    onFocus?: AnyFunction
    className?: string
    inputClassName?: string
    groupClassName?: string
    validationMessageClassName?: string
}

//TODO DESTRUCTURIZE PROPS

export const Input = memo((props: InputProps) => {
    const {
        name,
        onChange,
        value,
        type,
        placeholder,
        validator,
        forwardRef,
        isHiddenBeforeBlur = true,
        isHiddenPermanently = false,
        className,
        inputClassName,
        validationMessageClassName,
        children,
        id,
        groupClassName,
        onFocus,
    } = props
    // const [isHidden, setIsHidden] = useState(isHiddenPermanently || isHiddenBeforeBlur)

    function blur() {
        validator?.setIsHidden(isHiddenPermanently)
        if (props.onBlur) props.onBlur()
    }

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        //validator?.validate(e.target.value)
        onChange(e.target.value)
    }

    useEffect(() => {
        validator?.setIsHidden(isHiddenPermanently || isHiddenBeforeBlur)
    }, [])

    useEffect(() => {
        validator?.validate(value || '')
    }, [value])

    return (
        <div className={`${styles.wrapper} ${className || ''}`}>
            <ValidationMessage
                className={validationMessageClassName}
                isHidden={!!validator?.isHidden}
                errorsString={validator?.errors || ''}
            />
            <div className={styles.group + ' ' + groupClassName || ''}>
                {(children || name) && (
                    <label className={styles.label}>
                        {children}
                        <span>{name}</span>
                    </label>
                )}
                <input
                    ref={forwardRef}
                    onBlur={blur}
                    onFocus={onFocus}
                    onChange={change}
                    value={value}
                    type={type === '' ? 'text' : type}
                    id={id}
                    autoComplete="on"
                    className={`${styles.input} ${inputClassName}`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
})
