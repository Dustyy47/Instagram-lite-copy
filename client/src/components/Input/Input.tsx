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
    className?: string
    styleWrapper?: React.CSSProperties
    styleLabel?: React.CSSProperties
    styleInput?: React.CSSProperties
    children?: React.ReactElement
    id?: string
    onFocus?: AnyFunction
    inputClassName?: string
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

    const wrapperClassName = `${styles.wrapper} ${props.className}`

    return (
        <div style={props.styleWrapper} className={wrapperClassName}>
            <ValidationMessage isHidden={!!validator?.isHidden} errorsString={validator?.errors || ''} />
            <div className={styles.group}>
                <label style={props.styleLabel} className={styles.label}>
                    {props.children}
                    <span>{name}</span>
                </label>
                <input
                    ref={forwardRef}
                    onBlur={blur}
                    onFocus={props.onFocus}
                    style={props.styleInput}
                    onChange={change}
                    value={value}
                    type={type === '' ? 'text' : type}
                    id={props.id}
                    autoComplete="on"
                    className={`${styles.input} ${props.inputClassName}`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
})
