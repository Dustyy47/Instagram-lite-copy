import { useEffect, useState } from 'react'
import { ValidationMessage } from '../ValidationMessage/ValidationMessage'
import styles from './Input.module.scss'

export function Input({
    name,
    onChange,
    value,
    type,
    placeholder,
    isColumn,
    validator,
    forwardRef,
    ...props
}) {
    const [showValidation, setShowValidation] = useState(false)

    const blur = () => {
        setShowValidation(true)
        if (props.onBlur) props.onBlur()
    }

    useEffect(() => {
        if (!props.needToValidate) {
            setShowValidation(false)
            return
        }
        validator?.validate('')
    }, [props.needToValidate])

    const change = (e) => {
        validator?.validate(e.target.value)
        onChange(e.target.value)
    }
    return (
        <div
            style={props.styleWrapper}
            className={`${styles.wrapper} ${props.className ? props.className : ''}`}
        >
            <ValidationMessage show={showValidation} errorsString={validator?.errors} />
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
}
