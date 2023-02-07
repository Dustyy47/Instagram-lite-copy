import { memo, useEffect, useState } from 'react'
import { Validator } from '../../hooks/validators/useValidator'
import { AnyFunction } from '../../models/CallbacksTypes'
import { ValidationMessage } from '../ValidationMessage/ValidationMessage'
import styles from './Input.module.scss'

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
    needToValidate?: boolean
    className?: string
    styleWrapper?: React.CSSProperties
    styleLabel?: React.CSSProperties
    styleInput?: React.CSSProperties
    children?: React.ReactElement
    id?: string
    onFocus?: AnyFunction
}

export const Input = memo(function Input(props: InputProps) {
    const { name, onChange, value, type, placeholder, validator, forwardRef } = props
    const [showValidation, setShowValidation] = useState(false)

    function blur() {
        setShowValidation(true)
        if (props.onBlur) props.onBlur()
    }

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        validator?.validate(e.target.value)
        onChange(e.target.value)
    }

    useEffect(() => {
        //TODO replace to !validator
        if (!props.needToValidate) {
            setShowValidation(false)
            return
        }
        validator?.validate('')
    }, [props.needToValidate])

    const wrapperClassName = `${styles.wrapper} ${props.className}`

    return (
        <div style={props.styleWrapper} className={wrapperClassName}>
            <ValidationMessage show={showValidation} errorsString={validator?.errors || ''} />
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
                    className={styles.input}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
})
